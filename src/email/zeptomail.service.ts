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
  let rawKey = process.env.ZEPTOMAIL_API_KEY || process.env.ZEPTOMAIL_SMTP_PASS || ''
  if ((rawKey.startsWith('"') && rawKey.endsWith('"')) || (rawKey.startsWith("'") && rawKey.endsWith("'"))) {
    rawKey = rawKey.slice(1, -1)
  }
  rawKey = rawKey.trim()

  const isIndia = (process.env.ZEPTOMAIL_SMTP_HOST || '').includes('.in') || (process.env.ZEPTOMAIL_URL || '').includes('.in')
  const defaultUrl = isIndia ? 'https://api.zeptomail.in/v1.1/email' : 'https://api.zeptomail.com/v1.1/email'

  // Format token cleanly: strip any duplicate prefix then add single Zoho-enczapikey prefix
  const cleanKey = rawKey.replace(/^Zoho-enczapikey\s+/i, '').trim()
  const formattedToken = cleanKey ? `Zoho-enczapikey ${cleanKey}` : ''

  return {
    apiKey: cleanKey,
    formattedToken,
    apiUrl: process.env.ZEPTOMAIL_URL || defaultUrl,
    senderEmail: (process.env.ZEPTOMAIL_FROM_EMAIL || process.env.ZEPTOMAIL_SENDER_EMAIL || 'noreply@troxcard.in').trim(),
    senderName: (process.env.ZEPTOMAIL_FROM_NAME || process.env.ZEPTOMAIL_SENDER_NAME || 'Trox Card').trim(),
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
      token: config.formattedToken,
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
    const errCode = error?.error?.code || error?.code
    console.error('[ZeptoMail Error]: Failed to dispatch mail via ZeptoMail SDK:', error)

    if (errCode === 'TM_4001' || error?.message?.includes('Access Denied')) {
      console.warn(`
[ZeptoMail Diagnostic]: TM_4001 Access Denied error. Please verify:
1. In ZeptoMail Dashboard -> Mail Agents -> Setup Info -> Send Mail Token:
   Ensure you copy the "Send Mail Token" and set ZEPTOMAIL_API_KEY="${config.apiKey.slice(0, 10)}..." in your .env file.
2. Ensure "${config.senderEmail}" is added & verified in your ZeptoMail Mail Agent sender domain settings.
3. Ensure region URL matches your account region (${config.apiUrl}).
`)
    }

    // Fallback: Dispatch via direct HTTP fetch to ZeptoMail REST API
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
      if (!fetchRes.ok) {
        console.error('[ZeptoMail API Error Response]:', data)
      }
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
