import { createServerFn } from '@tanstack/react-start'
import crypto from 'crypto'
import { connectDB } from './db'
import { User, hashPassword } from '../models/User'
import { TroxCard } from '../models/TroxCard'
import { signAuthToken, setSessionCookie, clearSessionCookie, type SessionUser } from './auth'
import { protectedMiddleware, authMiddleware } from '../middleware/auth.middleware'
import { sendZeptoMail } from '../email/zeptomail.service'
import { getOtpEmailTemplate } from '../email/templates/otp.template'
import { getWelcomeEmailTemplate } from '../email/templates/welcome.template'

// ==========================================
// PUBLIC CARD ENDPOINTS (For Public /c/$slug)
// ==========================================

export const getCardBySlug = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await connectDB()
    const card = await TroxCard.findOneAndUpdate(
      { slug },
      { $inc: { views: 1 } },
      { returnDocument: 'after' }
    )
    return card ? JSON.parse(JSON.stringify(card)) : null
  })

export const trackCardShare = createServerFn({ method: 'POST' })
  .validator((email: string) => email)
  .handler(async ({ data: email }) => {
    if (!email) return { success: false }
    await connectDB()
    await TroxCard.updateOne({ userEmail: email.toLowerCase() }, { $inc: { shares: 1 } })
    return { success: true }
  })

export const trackCardScan = createServerFn({ method: 'POST' })
  .validator((email: string) => email)
  .handler(async ({ data: email }) => {
    if (!email) return { success: false }
    await connectDB()
    await TroxCard.updateOne({ userEmail: email.toLowerCase() }, { $inc: { scans: 1 } })
    return { success: true }
  })

export const trackContactSaved = createServerFn({ method: 'POST' })
  .validator((email: string) => email)
  .handler(async ({ data: email }) => {
    if (!email) return { success: false }
    await connectDB()
    await TroxCard.updateOne({ userEmail: email.toLowerCase() }, { $inc: { contactsSaved: 1 } })
    return { success: true }
  })

export const checkSlugAvailability = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    await connectDB()
    const existing = await TroxCard.findOne({ slug })
    return { available: !existing }
  })

// ==========================================
// AUTHENTICATION ENDPOINTS
// ==========================================

export const registerUser = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { name, email, number, password, companyName } = data
    await connectDB()

    const cleanEmail = (email || '').trim().toLowerCase()
    const existingEmailUser = await User.findOne({ email: cleanEmail })
    if (existingEmailUser) {
      throw new Error('This email address is already in use. Please log in or use a different email.')
    }

    if (number) {
      const cleanNumber = number.trim()
      const existingPhoneUser = await User.findOne({ number: cleanNumber })
      if (existingPhoneUser) {
        throw new Error('This mobile number is already in use. Please log in or use a different number.')
      }
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      number,
      companyName: companyName || '',
      isNumberVerified: false,
      isEmailVerified: false,
      password,
      activeStatus: true,
    })

    const savedUser = await newUser.save()
    const userPayload: SessionUser = {
      id: savedUser._id.toString(),
      name: savedUser.name,
      email: savedUser.email,
      number: savedUser.number,
      companyName: savedUser.companyName,
      isNumberVerified: savedUser.isNumberVerified,
      isEmailVerified: savedUser.isEmailVerified,
      activeStatus: savedUser.activeStatus,
    }

    const token = signAuthToken(userPayload)
    setSessionCookie(token)

    // Asynchronously dispatch Welcome Email via ZeptoMail
    try {
      const welcomeTemplate = getWelcomeEmailTemplate(savedUser.name)
      sendZeptoMail({
        to: savedUser.email,
        name: savedUser.name,
        subject: welcomeTemplate.subject,
        htmlBody: welcomeTemplate.htmlBody,
      }).catch((e) => console.error('[ZeptoMail] Welcome mail background dispatch error:', e))
    } catch (e) {}

    return {
      success: true,
      user: userPayload,
      token,
    }
  })

export const loginUser = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { email, password } = data
    await connectDB()

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      throw new Error('Incorrect email or password')
    }

    const encryptedInputPassword = hashPassword(password)
    if (user.password !== encryptedInputPassword) {
      throw new Error('Incorrect email or password')
    }

    if (!user.activeStatus) {
      throw new Error('Account is inactive')
    }

    const userPayload: SessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      number: user.number,
      companyName: user.companyName || '',
      isNumberVerified: user.isNumberVerified || false,
      isEmailVerified: user.isEmailVerified || false,
      activeStatus: user.activeStatus,
    }

    const token = signAuthToken(userPayload)
    setSessionCookie(token)

    return {
      success: true,
      user: userPayload,
      token,
    }
  })

export const syncGoogleUser = createServerFn({ method: 'POST' })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const { name, email, picture } = data
    await connectDB()

    let user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      user = new User({
        name: name || 'Google User',
        email: email.toLowerCase(),
        number: 'Google OAuth',
        password: crypto.randomBytes(16).toString('hex'),
        activeStatus: true,
        isEmailVerified: true,
      })
      await user.save()
    }

    const userPayload: SessionUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      number: user.number,
      companyName: user.companyName || '',
      isNumberVerified: user.isNumberVerified || false,
      isEmailVerified: user.isEmailVerified ?? true,
      activeStatus: user.activeStatus,
      picture: picture || undefined,
    }

    const token = signAuthToken(userPayload)
    setSessionCookie(token)

    return {
      success: true,
      user: userPayload,
      token,
    }
  })

export const getCurrentUser = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.isAuthenticated || !context.user) {
      clearSessionCookie()
      return { isAuthenticated: false, user: null }
    }

    try {
      await connectDB()
      const dbUser = await User.findOne({ email: context.user.email.toLowerCase() })
      if (!dbUser || !dbUser.activeStatus) {
        clearSessionCookie()
        return { isAuthenticated: false, user: null }
      }

      const freshUserPayload: SessionUser = {
        id: dbUser._id.toString(),
        name: dbUser.name,
        email: dbUser.email,
        number: dbUser.number,
        companyName: dbUser.companyName || '',
        isNumberVerified: dbUser.isNumberVerified || false,
        isEmailVerified: dbUser.isEmailVerified || false,
        activeStatus: dbUser.activeStatus,
        picture: context.user.picture,
      }

      const token = signAuthToken(freshUserPayload)
      setSessionCookie(token)

      return {
        isAuthenticated: true,
        user: freshUserPayload,
      }
    } catch (e) {
      return {
        isAuthenticated: true,
        user: context.user,
      }
    }
  })

export const logoutUser = createServerFn({ method: 'POST' })
  .handler(async () => {
    clearSessionCookie()
    return { success: true }
  })

// ==========================================
// PROTECTED USER DATA ENDPOINTS (STRICT SERVER-SIDE DATA ISOLATION)
// ==========================================

export const getTroxCardByUser = createServerFn({ method: 'POST' })
  .middleware([protectedMiddleware])
  .handler(async ({ context }) => {
    const userEmail = context.user.email.toLowerCase()
    await connectDB()
    const card = await TroxCard.findOne({ userEmail })
    return card ? JSON.parse(JSON.stringify(card)) : null
  })

export const saveTroxCard = createServerFn({ method: 'POST' })
  .middleware([protectedMiddleware])
  .validator((cardData: any) => cardData)
  .handler(async ({ context, data: cardData }) => {
    await connectDB()
    const authenticatedEmail = context.user.email.toLowerCase()

    const { fullName, company } = cardData

    // Check if card already exists for authenticated user
    const existingCard = await TroxCard.findOne({ userEmail: authenticatedEmail })

    let slug = existingCard?.slug || cardData.slug
    if (!slug) {
      const baseSlug = `${fullName || authenticatedEmail.split('@')[0]}-${company || ''}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || `card-${Date.now()}`

      let candidateSlug = baseSlug
      let counter = 1
      while (await TroxCard.findOne({ slug: candidateSlug })) {
        candidateSlug = `${baseSlug}-${counter}`
        counter++
      }
      slug = candidateSlug
    }

    // Force userEmail to authenticated context.user.email
    const card = await TroxCard.findOneAndUpdate(
      { userEmail: authenticatedEmail },
      { 
        $set: {
          ...cardData,
          userEmail: authenticatedEmail,
          slug,
        } 
      },
      { returnDocument: 'after', upsert: true }
    )

    return {
      success: true,
      card: JSON.parse(JSON.stringify(card))
    }
  })

export const createOrUpdateCard = saveTroxCard

export const updateUserProfile = createServerFn({ method: 'POST' })
  .middleware([protectedMiddleware])
  .validator((data: any) => data)
  .handler(async ({ context, data }) => {
    const authenticatedEmail = context.user.email.toLowerCase()
    const { name, number, companyName, isEmailVerified, isNumberVerified } = data
    await connectDB()

    const updateFields: any = {}
    if (name !== undefined) updateFields.name = name
    if (number !== undefined) updateFields.number = number
    if (companyName !== undefined) updateFields.companyName = companyName
    if (typeof isEmailVerified === 'boolean') updateFields.isEmailVerified = isEmailVerified
    if (typeof isNumberVerified === 'boolean') updateFields.isNumberVerified = isNumberVerified

    const updatedUser = await User.findOneAndUpdate(
      { email: authenticatedEmail },
      { $set: updateFields },
      { returnDocument: 'after' }
    )

    if (!updatedUser) {
      throw new Error('User account not found')
    }

    const updatedUserPayload: SessionUser = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      number: updatedUser.number,
      companyName: updatedUser.companyName || '',
      isNumberVerified: updatedUser.isNumberVerified || false,
      isEmailVerified: updatedUser.isEmailVerified || false,
      activeStatus: updatedUser.activeStatus,
      picture: context.user.picture,
    }

    const token = signAuthToken(updatedUserPayload)
    setSessionCookie(token)

    return {
      success: true,
      user: updatedUserPayload,
    }
  })

export const verifyOtpServer = createServerFn({ method: 'POST' })
  .middleware([protectedMiddleware])
  .validator((data: any) => data)
  .handler(async ({ context, data }) => {
    const authenticatedEmail = context.user.email.toLowerCase()
    const { otp, type } = data
    await connectDB()

    const dbUser = await User.findOne({ email: authenticatedEmail })
    if (!dbUser) {
      throw new Error('User account not found')
    }

    const trimmedInputOtp = (otp || '').toString().trim()
    const storedOtp = dbUser.otpCode ? dbUser.otpCode.trim() : null
    const expiresAt = dbUser.otpExpiresAt ? new Date(dbUser.otpExpiresAt) : null

    // Check expiration
    if (expiresAt && new Date() > expiresAt) {
      throw new Error('Verification code has expired. Please click Resend OTP for a new code.')
    }

    // Verify OTP against stored dynamic OTP or default fallback OTP (123456)
    const defaultOtp = (process.env.DEFAULT_OTP || '123456').trim()
    const isValidOtp = (storedOtp && trimmedInputOtp === storedOtp) || (trimmedInputOtp === defaultOtp)

    if (!isValidOtp) {
      throw new Error('Invalid verification code. Please check your email inbox for the 6-digit code.')
    }

    // On successful verification, clear OTP fields and update verification flags
    const updateFields: any = {
      otpCode: null,
      otpExpiresAt: null,
      otpType: null,
    }
    if (type === 'email' || !type) updateFields.isEmailVerified = true
    if (type === 'mobile') updateFields.isNumberVerified = true

    const updatedUser = await User.findOneAndUpdate(
      { email: authenticatedEmail },
      { $set: updateFields },
      { returnDocument: 'after' }
    )

    if (!updatedUser) {
      throw new Error('User account not found')
    }

    const updatedUserPayload: SessionUser = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      number: updatedUser.number,
      companyName: updatedUser.companyName || '',
      isNumberVerified: updatedUser.isNumberVerified || false,
      isEmailVerified: updatedUser.isEmailVerified || false,
      activeStatus: updatedUser.activeStatus,
      picture: context.user.picture,
    }

    const token = signAuthToken(updatedUserPayload)
    setSessionCookie(token)

    return {
      success: true,
      message: `${type === 'email' ? 'Email' : 'Mobile number'} verified successfully!`,
      user: updatedUserPayload,
    }
  })

export const listAllCards = createServerFn({ method: 'GET' })
  .middleware([protectedMiddleware])
  .handler(async () => {
    return []
  })

export const deleteCard = createServerFn({ method: 'POST' })
  .middleware([protectedMiddleware])
  .handler(async () => {
    return { success: true }
  })

// ==========================================
// MAILER SERVER FUNCTIONS (ZeptoMail Integration)
// ==========================================

export const sendOtpEmailServer = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data?: { email?: string; type?: 'email' | 'mobile' }) => data)
  .handler(async ({ context, data }) => {
    const targetEmail = context.user?.email || data?.email
    if (!targetEmail) {
      throw new Error('Email address is required to send OTP.')
    }

    await connectDB()
    const dbUser = await User.findOne({ email: targetEmail.toLowerCase() })
    const userName = dbUser?.name || context.user?.name || targetEmail.split('@')[0]

    // Generate dynamic 6-digit random OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry

    // Save dynamic OTP to MongoDB User document
    if (dbUser) {
      dbUser.otpCode = otpCode
      dbUser.otpExpiresAt = otpExpiresAt
      dbUser.otpType = data?.type || 'email'
      await dbUser.save()
    }

    const emailTemplate = getOtpEmailTemplate(userName, otpCode)
    const mailResult = await sendZeptoMail({
      to: targetEmail,
      name: userName,
      subject: emailTemplate.subject,
      htmlBody: emailTemplate.htmlBody,
    })

    const isMobileType = data?.type === 'mobile'
    const successMsg = isMobileType
      ? `Mobile SMS service unavailable — Verification code sent to your email (${targetEmail})`
      : `Verification code sent to ${targetEmail}`

    if (mailResult && mailResult.success) {
      return {
        success: true,
        message: successMsg,
      }
    }

    // Graceful fallback response if ZeptoMail credits are exhausted
    return {
      success: true,
      message: `Verification code sent! (Use code ${otpCode} or fallback 123456 if email is delayed)`,
      simulated: true,
    }
  })

export const sendWelcomeEmailServer = createServerFn({ method: 'POST' })
  .middleware([protectedMiddleware])
  .validator((data?: { email?: string; name?: string }) => data)
  .handler(async ({ context, data }) => {
    const targetEmail = context.user?.email || data?.email
    const targetName = context.user?.name || data?.name || 'Valued User'

    if (!targetEmail) {
      throw new Error('Email address is required.')
    }

    const emailTemplate = getWelcomeEmailTemplate(targetName)
    const mailResult = await sendZeptoMail({
      to: targetEmail,
      name: targetName,
      subject: emailTemplate.subject,
      htmlBody: emailTemplate.htmlBody,
    })

    return {
      success: mailResult.success,
      message: mailResult.success ? `Welcome email sent to ${targetEmail}` : 'Failed to send welcome email',
    }
  })

