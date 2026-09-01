import { SendMailClient } from 'zeptomail'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

// Helper to ensure .env variables are loaded in node environment
function ensureEnvLoaded() {
  if (process.env.ZEPTOMAIL_SMTP_PASS || process.env.ZEPTOMAIL_API_KEY || process.env.SMTP_PASS) {
    return
  }
  try {
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8')
      envContent.split('\n').forEach((line) => {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/)
          if (match) {
            const key = match[1].trim()
            let val = match[2].trim()
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1)
            }
            if (!process.env[key]) {
              process.env[key] = val
            }
          }
        }
      })
    }
  } catch (e) {}
}

// Read ZeptoMail and SMTP credentials safely from process.env
const getZeptoMailConfig = () => {
  ensureEnvLoaded()
  let rawKey = process.env.ZEPTOMAIL_API_KEY || process.env.ZEPTOMAIL_SMTP_PASS || ''
  if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
    rawKey = rawKey.slice(1, -1)
  }
  rawKey = rawKey.trim()

  const isIndia = (process.env.ZEPTOMAIL_SMTP_HOST || '').includes('.in') || (process.env.ZEPTOMAIL_URL || '').includes('.in')
  const defaultUrl = isIndia ? 'https://api.zeptomail.in/v1.1/email' : 'https://api.zeptomail.com/v1.1/email'

  const cleanKey = rawKey.replace(/^Zoho-enczapikey\s+/i, '').trim()
  const formattedToken = cleanKey ? `Zoho-enczapikey ${cleanKey}` : ''

  return {
    apiKey: cleanKey,
    formattedToken,
    apiUrl: process.env.ZEPTOMAIL_URL || defaultUrl,
    senderEmail: (process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_SENDER_EMAIL || process.env.SMTP_FROM || 'noreply@troxcard.in').trim(),
    senderName: (process.env.ZEPTOMAIL_FROM_NAME || process.env.ZEPTOMAIL_SENDER_NAME || 'Trox Card').trim(),
    // Optional fallback standard SMTP config
    smtpHost: process.env.SMTP_HOST || process.env.ZEPTOMAIL_SMTP_HOST,
    smtpPort: parseInt(process.env.SMTP_PORT || process.env.ZEPTOMAIL_SMTP_PORT || '587', 10),
    smtpUser: process.env.SMTP_USER || process.env.ZEPTOMAIL_SMTP_USER || 'emailapikey',
    smtpPass: process.env.SMTP_PASS || cleanKey,
    smtpSecure: process.env.SMTP_SECURE === 'true' || process.env.ZEPTOMAIL_SMTP_PORT === '465',
  }
}

export interface SendEmailPayload {
  to: string
  name?: string
  subject: string
  htmlBody: string
  textBody?: string
}

/**
 * Send Transactional Email using ZeptoMail REST API with Nodemailer SMTP fallback
 */
export async function sendZeptoMail(payload: SendEmailPayload) {
  const config = getZeptoMailConfig()

  if (!config.apiKey || config.apiKey === 'your_zeptomail_api_key_here') {
    console.warn('[ZeptoMail Warning]: ZeptoMail API key is missing in .env.')
    return {
      success: false,
      message: 'ZeptoMail API Key missing in .env',
      simulated: true,
      payload,
    }
  }

  // 1. Primary Dispatch via ZeptoMail API
  try {
    const fetchRes = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: config.formattedToken,
      },
      body: JSON.stringify({
        from: {
          address: config.senderEmail,
          name: config.senderName,
        },
        to: [
          {
            email_address: {
              address: payload.to,
              name: payload.name || payload.to.split('@')[0],
            },
          },
        ],
        subject: payload.subject,
        htmlbody: payload.htmlBody,
      }),
    })

    const data = await fetchRes.json()

    if (fetchRes.ok) {
      return { success: true, data }
    }

    const errCode = data?.error?.code || ''
    const errMessage = data?.error?.message || ''
    const details = data?.error?.details || []

    console.error(`[ZeptoMail API Error ${fetchRes.status}]:`, JSON.stringify(data))

    if (errCode === 'TM_5001' || details.some((d: any) => d.code === 'LE_102')) {
      console.error(`
🚨 [ZeptoMail Error - CREDIT EXHAUSTED]:
Your ZeptoMail account has 0 remaining email credits.
Please log into https://zeptomail.zoho.in/ and top up email credits, or configure a fallback SMTP server (e.g. Gmail / AWS SES / Resend) in .env:
  SMTP_HOST="smtp.gmail.com"
  SMTP_PORT="587"
  SMTP_USER="your-email@gmail.com"
  SMTP_PASS="your-app-password"
`)
    } else if (errCode === 'TM_4001') {
      console.error(`
🚨 [ZeptoMail Error - ACCESS DENIED]:
Please check that ZEPTOMAIL_API_KEY in .env contains a valid Send Mail Token from ZeptoMail Setup Info.
`)
    }
  } catch (apiErr: any) {
    console.error('[ZeptoMail API Network Error]:', apiErr)
  }

  // 2. Secondary Fallback Dispatch via Nodemailer SMTP (if SMTP_HOST is configured)
  if (process.env.SMTP_HOST && process.env.SMTP_PASS) {
    try {
      console.log('[Email Dispatch]: Attempting fallback via Nodemailer SMTP...')
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
      })

      const info = await transporter.sendMail({
        from: `"${config.senderName}" <${config.senderEmail}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.htmlBody,
      })

      console.log('[Email Dispatch]: Successfully dispatched via Nodemailer SMTP:', info.messageId)
      return { success: true, via: 'smtp', messageId: info.messageId }
    } catch (smtpErr: any) {
      console.error('[Email Dispatch SMTP Error]:', smtpErr)
    }
  }

  return {
    success: false,
    message: 'Failed to send email. Check server logs for ZeptoMail / SMTP error details.',
  }
}
