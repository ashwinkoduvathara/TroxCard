import crypto from 'crypto'
import { setCookie, deleteCookie } from '@tanstack/react-start/server'

const JWT_SECRET = process.env.JWT_SECRET || 'troxcard_super_secret_auth_key_2026'
export const TROXCARD_SESSION_COOKIE = 'troxcard_session'

export interface SessionUser {
  id: string
  name: string
  email: string
  number: string
  companyName?: string
  isEmailVerified: boolean
  isNumberVerified: boolean
  activeStatus: boolean
  picture?: string
}

// Generate base64url HMAC token
export function signAuthToken(payload: SessionUser): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) })).toString('base64url')
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url')

  return `${header}.${body}.${signature}`
}

// Verify base64url HMAC token
export function verifyAuthToken(token: string): SessionUser | null {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, signature] = parts
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url')

    if (signature !== expectedSignature) return null

    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8'))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null // Expired token
    }

    return payload as SessionUser
  } catch (e) {
    return null
  }
}

// Server-side helper to set HTTP-Only session cookie
export function setSessionCookie(token: string) {
  try {
    setCookie(TROXCARD_SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    })
  } catch (e) {
    // Graceful fallback if invoked outside server handler context
  }
}

// Server-side helper to clear HTTP-Only session cookie
export function clearSessionCookie() {
  try {
    deleteCookie(TROXCARD_SESSION_COOKIE, { path: '/' })
  } catch (e) {
    // Graceful fallback
  }
}

// Helper to check if provided OTP is valid (Hardcoded 123456 from process.env.DEFAULT_OTP)
export function isValidOtp(inputOtp: string): boolean {
  const defaultOtp = process.env.DEFAULT_OTP || '123456'
  return inputOtp.trim() === defaultOtp.trim()
}
