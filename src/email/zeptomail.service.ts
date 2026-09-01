import { SendMailClient } from 'zeptomail'
import fs from 'fs'
import path from 'path'

// Helper to ensure .env variables are loaded in node environment
function ensureEnvLoaded() {
  if (process.env.ZEPTOMAIL_SMTP_PASS || process.env.ZEPTOMAIL_API_KEY) {
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

// Read ZeptoMail credentials safely from process.env
const getZeptoMailConfig = () => {
  ensureEnvLoaded()
  const apiKey = process.env.ZEPTOMAIL_API_KEY || process.env.ZEPTOMAIL_SMTP_PASS || ''
  const isIndia = (process.env.ZEPTOMAIL_SMTP_HOST || '').includes('.in')
  const defaultUrl = isIndia ? 'https://api.zeptomail.in/v1.1/email' : 'https://api.zeptomail.com/v1.1/email'

  return {
    apiKey,
    apiUrl: process.env.ZEPTOMAIL_URL || defaultUrl,
    senderEmail: process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_SENDER_EMAIL || 'noreply@troxcard.in',
    senderName: process.env.ZEPTOMAIL_FROM_NAME || process.env.ZEPTOMAIL_SENDER_NAME || 'Trox Card',
  }
}

// Interface for Email Parameters
export interface SendEmailPayload {
  to: string
  name?: string
  subject: string
  htmlBody: string
  textBody?: string
}

/**
 * Send Transactional Email using ZeptoMail REST API / SDK
 */
export async function sendZeptoMail(payload: SendEmailPayload) {
  const config = getZeptoMailConfig()

  if (!config.apiKey || config.apiKey === 'your_zeptomail_api_key_here') {
    console.warn('[ZeptoMail Warning]: ZeptoMail API key is not configured in .env. Skipping actual mail dispatch.')
    return {
      success: false,
      message: 'ZeptoMail API Key missing in .env',
      simulated: true,
      payload,
    }
  }

  try {
    // Try sending using official ZeptoMail SDK
    const client = new SendMailClient({
      url: config.apiUrl,
      token: config.apiKey.startsWith('Zoho-enczapikey')
        ? config.apiKey
        : `Zoho-enczapikey ${config.apiKey}`,
    })

    const response = await client.sendMail({
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
    })

    return {
      success: true,
      response,
    }
  } catch (error: any) {
    console.error('[ZeptoMail Error]: Failed to dispatch mail via ZeptoMail SDK:', error)

    // Fallback: Dispatch via direct HTTP fetch to ZeptoMail REST API
    try {
      const fetchRes = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: config.apiKey.startsWith('Zoho-enczapikey')
            ? config.apiKey
            : `Zoho-enczapikey ${config.apiKey}`,
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
      return {
        success: fetchRes.ok,
        data,
      }
    } catch (fallbackErr) {
      console.error('[ZeptoMail Fallback Error]: Direct API call failed:', fallbackErr)
      throw error
    }
  }
}
