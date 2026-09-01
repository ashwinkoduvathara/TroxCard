import { createMiddleware } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'
import { verifyAuthToken, TROXCARD_SESSION_COOKIE, type SessionUser } from '../lib/auth'

// Request middleware inspecting session cookies
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const sessionCookie = getCookie(TROXCARD_SESSION_COOKIE)
  const user: SessionUser | null = sessionCookie ? verifyAuthToken(sessionCookie) : null

  return next({
    context: {
      user,
      isAuthenticated: !!user,
    },
  })
})

// Protected route middleware throwing error/redirect if unauthenticated
export const protectedMiddleware = createMiddleware()
  .middleware([authMiddleware])
  .server(async ({ next, context }) => {
    if (!context.isAuthenticated || !context.user) {
      throw new Error('Unauthorized: Authentication required')
    }
    return next({
      context: {
        user: context.user,
      },
    })
  })
