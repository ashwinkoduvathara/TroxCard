import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { 
  User, Lock, Eye, EyeOff, LogOut, CheckCircle2, Mail, Smartphone,
  Bell, ChevronRight, Share2, UserPlus, Home, Users, MessageSquare,
  Settings, Plus, BarChart3, Download, Contact, QrCode, X, Send, Check, Edit2,
  RefreshCw, MessageCircle, Building, Lightbulb, Upload, Wifi,
  ChevronLeft, Camera, Briefcase, Quote, Phone, Globe, MapPin, Link, Printer,
  FileText, Trash2, MousePointerClick, ChevronDown, Info, CreditCard
} from 'lucide-react'
import { registerUser, loginUser, syncGoogleUser, updateUserProfile, saveTroxCard, getTroxCardByUser, verifyOtpServer, trackCardShare, trackCardScan, getCurrentUser, logoutUser, sendOtpEmailServer } from '../lib/card.functions'
import QRCode from 'qrcode'

declare global {
  interface Window {
    google: any
  }
}

// Social Media Brand SVG Components
function InstagramIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function FacebookIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function LinkedinIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

// Fancy Stylized QR Code Component with Rounded Modules, Custom Finder Eyes, and Center Brand Badge
function FancyQRCode({ 
  value, 
  size,
  darkColor = '#7c3aed', 
  eyeColor = '#6d28d9',
  lightColor = '#ffffff', 
  centerLogo = true,
  className = ""
}: { 
  value: string; 
  size?: number | string;
  darkColor?: string; 
  eyeColor?: string;
  lightColor?: string; 
  centerLogo?: boolean;
  className?: string 
}) {
  const [qrData, setQrData] = useState<{ matrix: number[][]; count: number } | null>(null)

  useEffect(() => {
    if (!value) return
    try {
      const qr = QRCode.create(value, { errorCorrectionLevel: 'H' })
      const count = qr.modules.size
      const data = qr.modules.data
      const matrix: number[][] = []

      for (let r = 0; r < count; r++) {
        const row: number[] = []
        for (let c = 0; c < count; c++) {
          row.push(data[r * count + c] ? 1 : 0)
        }
        matrix.push(row)
      }
      setQrData({ matrix, count })
    } catch (e) {
      console.error('Error generating fancy QR:', e)
    }
  }, [value])

  if (!qrData) {
    return <div style={size ? { width: size, height: size } : undefined} className={`bg-purple-100/30 animate-pulse rounded-2xl ${className}`} />
  }

  const { matrix, count } = qrData
  const cellSize = 10
  const viewBoxSize = count * cellSize
  const centerStart = Math.floor(count / 2) - 3
  const centerEnd = Math.floor(count / 2) + 3

  const isEye = (r: number, c: number) => {
    if (r < 7 && c < 7) return true
    if (r < 7 && c >= count - 7) return true
    if (r >= count - 7 && c < 7) return true
    return false
  }

  const isCenter = (r: number, c: number) => {
    if (!centerLogo) return false
    return r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd
  }

  const modules: React.ReactNode[] = []
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (matrix[r][c] === 1 && !isEye(r, c) && !isCenter(r, c)) {
        modules.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize + 1}
            y={r * cellSize + 1}
            width={cellSize - 2}
            height={cellSize - 2}
            rx={cellSize * 0.35}
            ry={cellSize * 0.35}
            fill={darkColor}
          />
        )
      }
    }
  }

  const renderEye = (startX: number, startY: number, key: string) => {
    const eyeWidth = 7 * cellSize
    return (
      <g key={key}>
        <rect
          x={startX + 2}
          y={startY + 2}
          width={eyeWidth - 4}
          height={eyeWidth - 4}
          rx={cellSize * 1.8}
          ry={cellSize * 1.8}
          fill="none"
          stroke={eyeColor}
          strokeWidth={cellSize * 0.9}
        />
        <rect
          x={startX + 2 * cellSize + 2}
          y={startY + 2 * cellSize + 2}
          width={3 * cellSize - 4}
          height={3 * cellSize - 4}
          rx={cellSize * 0.9}
          ry={cellSize * 0.9}
          fill={eyeColor}
        />
      </g>
    )
  }

  const logoCenterWidth = (centerEnd - centerStart + 1) * cellSize

  return (
    <div className={`relative inline-block ${className}`} style={size ? { width: size, height: size } : undefined}>
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        className="w-full h-full"
        style={{ background: lightColor, borderRadius: '1.25rem' }}
      >
        {renderEye(0, 0, 'tl')}
        {renderEye((count - 7) * cellSize, 0, 'tr')}
        {renderEye(0, (count - 7) * cellSize, 'bl')}
        {modules}
        {centerLogo && (
          <g>
            <circle cx={viewBoxSize / 2} cy={viewBoxSize / 2} r={logoCenterWidth / 2} fill="#ffffff" />
            <circle cx={viewBoxSize / 2} cy={viewBoxSize / 2} r={logoCenterWidth / 2 - 4} fill={darkColor} />
            <text
              x={viewBoxSize / 2}
              y={viewBoxSize / 2 + 5}
              textAnchor="middle"
              fill="#ffffff"
              fontSize={logoCenterWidth * 0.5}
              fontWeight="900"
              fontFamily="sans-serif"
            >
              K
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}

function QRCodeImage(props: any) {
  return (
    <FancyQRCode
      value={props.value}
      darkColor={props.darkColor === '#ffffff' ? '#ffffff' : '#7c3aed'}
      eyeColor={props.darkColor === '#ffffff' ? '#ffffff' : '#6d28d9'}
      lightColor={props.lightColor || '#ffffff'}
      className={props.className}
      centerLogo={true}
    />
  )
}

export const Route = createFileRoute('/')({
  loader: async () => {
    return { cards: [] }
  },
  component: Dashboard,
})

// Custom NFC waves icon
export function NfcIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M5 8a6 6 0 0 1 0 8M8 6a9 9 0 0 1 0 12M11 4a12 12 0 0 1 0 16M14 2a15 15 0 0 1 0 20" />
    </svg>
  )
}

// Custom simulated high-fidelity QR code
export function SimulatedQrCode({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      {/* Finder Pattern Top-Left */}
      <path d="M0 0h28v28H0zm4 4v20h20V4zm4 4h12v12H8z" />
      {/* Finder Pattern Top-Right */}
      <path d="M72 0h28v28H72zm4 4v20h20V4zm4 4h12v12H80z" />
      {/* Finder Pattern Bottom-Left */}
      <path d="M0 72h28v28H0zm4 4v20h20V4zm4 4h12v12H8z" />
      {/* Alignment Pattern Bottom-Right */}
      <path d="M76 76h8v8h-8z" />
      {/* Simulated bits (random structured matrix) */}
      <path d="M36 4h4v4h-4zm8 0h4v8h-4zm8 0h4v4h-4zm8 0h4v4h-4zm-24 8h4v4h-4zm12 0h4v4h-4zm8 0h8v4h-8zm-20 8h8v4h-8zm12 0h4v8h-4zm8 0h4v4h-4zm-20 8h4v4h-4zm8 0h4v4h-4zm12 0h8v4h-8zm12 0h4v4h-4zm-32 8h8v4h-8zm12 0h4v4h-4zm8 0h4v8h-4zm12 0h4v4h-4zm-36 8h4v4h-4zm8 0h4v4h-4zm16 0h4v4h-4zm8 0h8v4h-8zm-36 8h4v4h-4zm12 0h8v4h-8zm8 0h4v4h-4zm8 0h4v4h-4zm8 0h4v4h-4z" />
    </svg>
  )
}

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'login' | 'signup'>('login')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contacts' | 'messages' | 'settings'>('dashboard')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileDropdown, setProfileDropdown] = useState(false)
  const [createModal, setCreateModal] = useState(false)
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [unlockedProThemes, setUnlockedProThemes] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [googleMobile, setGoogleMobile] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [editingTarget, setEditingTarget] = useState<'email' | 'phone' | null>(null)
  const [customEmail, setCustomEmail] = useState('')
  const [customPhone, setCustomPhone] = useState('')
  const [otpRequested, setOtpRequested] = useState(false)
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', ''])
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', ''])
  const [verifyStep, setVerifyStep] = useState<'otp' | 'verified_success' | 'company_input'>('otp')
  const [companyInput, setCompanyInput] = useState('')

  const quickActionsRef = useRef<HTMLDivElement>(null)
  const [quickActionsActiveIndex, setQuickActionsActiveIndex] = useState(0)

  const handleQuickActionsScroll = () => {
    if (quickActionsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = quickActionsRef.current
      const maxScroll = scrollWidth - clientWidth
      if (maxScroll <= 0) return
      const scrollRatio = scrollLeft / maxScroll
      if (scrollRatio <= 0.33) {
        setQuickActionsActiveIndex(0)
      } else if (scrollRatio <= 0.66) {
        setQuickActionsActiveIndex(1)
      } else {
        setQuickActionsActiveIndex(2)
      }
    }
  }

  const mainScrollRef = useRef<HTMLDivElement>(null)
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false)

  const handleMainScroll = () => {
    if (mainScrollRef.current) {
      setIsHeaderScrolled(mainScrollRef.current.scrollTop > 10)
    }
  }
  
  // Login Form States
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // Signup Form States
  const [fullName, setFullName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupCompany] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  // Auth User Profile State (Sets to default mock profile if they log in normally)
  const [user, setUser] = useState<any>(null)
  const [editProfileModal, setEditProfileModal] = useState(false)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editCompany, setEditCompany] = useState('')

  // Edit Card Form Wizard States (Screenshot Match)
  const [editCardStep, setEditCardStep] = useState<number>(1)
  const [cardFullName, setCardFullName] = useState('Ashwin Baby')
  const [cardJobTitle, setCardJobTitle] = useState('Software Developer')
  const [cardCompany, setCardCompany] = useState('Kodeversity')
  const [cardBio, setCardBio] = useState('Building digital solutions that make an impact.')
  const [cardPhone, setCardPhone] = useState('+91 7356 567 890')
  const [cardEmail, setCardEmail] = useState('ashwin@kodeversity.com')
  const [cardWebsite, setCardWebsite] = useState('https://kodeversity.com')
  const [cardLocation, setCardLocation] = useState('Kerala, India')
  const [showContactInfo, setShowContactInfo] = useState(true)
  const [cardInstagram, setCardInstagram] = useState('https://instagram.com/ashwin_baby')
  const [cardWhatsapp, setCardWhatsapp] = useState('https://wa.me/917356567890')
  const [cardFacebook, setCardFacebook] = useState('https://facebook.com/ashwinbaby')
  const [cardLinkedin, setCardLinkedin] = useState('https://linkedin.com/in/ashwinbaby')
  const [cardAltPhone, setCardAltPhone] = useState('')
  const [cardFax, setCardFax] = useState('')
  const [cardCustomCta, setCardCustomCta] = useState('')

  // Step 3 Content States (Screenshot Match)
  const [cardAboutBio, setCardAboutBio] = useState('We build digital solutions that help businesses grow and make an impact.')
  const [cardBrochureName, setCardBrochureName] = useState('Company Brochure.pdf')
  const [cardBrochureSize, setCardBrochureSize] = useState('2.4 MB')
  const [cardCtaText, setCardCtaText] = useState('Book a Meeting')
  const [cardCtaLink, setCardCtaLink] = useState('https://calendly.com/ashwin/meet')
  const [cardCtaStyle] = useState<'primary' | 'outline' | 'whatsapp'>('primary')
  const [cardAddress, setCardAddress] = useState('Kochi, Kerala, India')
  const [cardCountry, setCardCountry] = useState('India')
  const [cardState, setCardState] = useState('Kerala')
  const [cardCity, setCardCity] = useState('Kochi')
  const [cardPinCode, setCardPinCode] = useState('682018')
  
  // Step 4 Theme Selection State
  const [selectedTheme, setSelectedTheme] = useState<string>('purple')

  // Analytics Metrics State (Dynamic from MongoDB)
  const [cardMetrics, setCardMetrics] = useState({
    views: 0,
    contactsSaved: 0,
    shares: 0,
    scans: 0,
  })

  const [isSavingCard, setIsSavingCard] = useState(false)

  // Save all Edit Card Form details strictly to MongoDB troxcard Collection without modifying other tables
  const handleSaveCardDetails = async () => {
    setIsSavingCard(true)
    try {
      const email = user?.email || cardEmail || 'guest@kodeversity.com'
      const cardPayload = {
        userEmail: email,
        fullName: cardFullName,
        jobTitle: cardJobTitle,
        company: cardCompany,
        bio: cardBio,
        phone: cardPhone,
        email: cardEmail,
        website: cardWebsite,
        location: cardLocation,
        showContactInfo,
        instagram: cardInstagram,
        whatsapp: cardWhatsapp,
        facebook: cardFacebook,
        linkedin: cardLinkedin,
        altPhone: cardAltPhone,
        fax: cardFax,
        customCta: cardCustomCta,
        aboutBio: cardAboutBio,
        brochureName: cardBrochureName,
        brochureSize: cardBrochureSize,
        ctaText: cardCtaText,
        ctaLink: cardCtaLink,
        ctaStyle: cardCtaStyle,
        address: cardAddress,
        country: cardCountry,
        state: cardState,
        city: cardCity,
        pinCode: cardPinCode,
        theme: selectedTheme,
      }

      // Save strictly to troxcard collection! (No other tables updated)
      const res = await saveTroxCard({ data: cardPayload })
      if (res && res.success && res.card) {
        if (res.card.slug && user) {
          const updatedUser = { ...user, slug: res.card.slug }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
    } catch (e: any) {
      console.error('Error saving business card details to troxcard collection:', e)
      const errorMsg = e?.message || (typeof e === 'string' ? e : 'Failed to save card details. Please try again.')
      alert(`Save Card Error: ${errorMsg}`)
    } finally {
      setIsSavingCard(false)
    }
  }

  // Centralized State Reset Function (Clears all in-memory user & card state on logout / account switch)
  const resetAllUserState = () => {
    setCardFullName('')
    setCardJobTitle('Software Developer')
    setCardCompany('')
    setCardBio('')
    setCardPhone('')
    setCardEmail('')
    setCardWebsite('')
    setCardLocation('')
    setShowContactInfo(true)
    setCardInstagram('')
    setCardWhatsapp('')
    setCardFacebook('')
    setCardLinkedin('')
    setCardAltPhone('')
    setCardFax('')
    setCardCustomCta('')
    setCardAboutBio('')
    setCardBrochureName('')
    setCardBrochureSize('')
    setCardCtaText('Book a Meeting')
    setCardCtaLink('')
    setCardAddress('')
    setCardCountry('India')
    setCardState('Kerala')
    setCardCity('Kochi')
    setCardPinCode('682018')
    setSelectedTheme('purple')
    setCardMetrics({ views: 0, contactsSaved: 0, shares: 0, scans: 0 })
    setGoogleMobile('')
    setEmailVerified(false)
    setPhoneVerified(false)
    setEditingTarget(null)
    setCustomEmail('')
    setCustomPhone('')
    setOtpRequested(false)
    setEmailOtp(['', '', '', '', '', ''])
    setPhoneOtp(['', '', '', '', '', ''])
    setVerifyStep('otp')
    setCompanyInput('')
    setEditCardStep(1)
    setCreateModal(false)
    setShowVerifyModal(false)
    setShowShareModal(false)
    setShowPayModal(false)
    setUnlockedProThemes(false)
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Restore & verify user session from server cookies on mount
  useEffect(() => {
    async function checkAuthSession() {
      try {
        const res = await getCurrentUser()
        if (res && res.isAuthenticated && res.user) {
          setUser(res.user)
          localStorage.setItem('user', JSON.stringify(res.user))
          setEditName(res.user.name || '')
          setEditEmail(res.user.email || '')
          setEditPhone(res.user.number || '')
          setEditCompany(res.user.companyName || '')
        } else {
          localStorage.removeItem('user')
          setUser(null)
          resetAllUserState()
        }
      } catch (e) {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser)
            setUser(parsed)
          } catch (err) {}
        }
      }
    }
    checkAuthSession()
  }, [])

  // Fetch TroxCard collection data if present, otherwise fallback to User table for first time
  useEffect(() => {
    async function loadCard() {
      if (!user?.email) return
      try {
        const card = await getTroxCardByUser({ data: user.email })
        if (card) {
          // Document EXISTS in troxcard collection: display and edit data from troxcard collection
          setCardMetrics({
            views: card.views || 0,
            contactsSaved: card.contactsSaved || 0,
            shares: card.shares || 0,
            scans: card.scans || 0,
          })

          setCardFullName(card.fullName !== undefined ? card.fullName : (user.name || ''))
          setCardJobTitle(card.jobTitle !== undefined ? card.jobTitle : 'Software Developer')
          setCardCompany(card.company !== undefined ? card.company : (user.companyName || 'Kodeversity'))
          setCardBio(card.bio || '')
          setCardPhone(card.phone !== undefined ? card.phone : (user.number !== 'Google OAuth' ? user.number || '' : ''))
          setCardEmail(card.email !== undefined ? card.email : (user.email || ''))
          setCardWebsite(card.website || '')
          setCardLocation(card.location || '')
          if (typeof card.showContactInfo === 'boolean') setShowContactInfo(card.showContactInfo)
          setCardInstagram(card.instagram || '')
          setCardWhatsapp(card.whatsapp || '')
          setCardFacebook(card.facebook || '')
          setCardLinkedin(card.linkedin || '')
          setCardAltPhone(card.altPhone || '')
          setCardFax(card.fax || '')
          setCardCustomCta(card.customCta || '')
          setCardAboutBio(card.aboutBio || '')
          setCardBrochureName(card.brochureName || '')
          setCardBrochureSize(card.brochureSize || '')
          setCardCtaText(card.ctaText || 'Book a Meeting')
          setCardCtaLink(card.ctaLink || '')
          setCardAddress(card.address || '')
          setCardCountry(card.country || 'India')
          setCardState(card.state || 'Kerala')
          setCardCity(card.city || 'Kochi')
          setCardPinCode(card.pinCode || '682018')
          if (card.theme) setSelectedTheme(card.theme)
        } else {
          // NO document in troxcard collection: display data from users collection (User model)
          setCardFullName(user.name || '')
          setCardEmail(user.email || '')
          setCardPhone(user.number !== 'Google OAuth' ? user.number || '' : '')
          setCardCompany(user.companyName || '')
          setCardJobTitle('Software Developer')
        }
      } catch (e) {
        console.error('Error fetching troxcard data:', e)
      }
    }
    loadCard()
  }, [user?.email])

  // Loading Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Smart Login Handler: Reset previous state first, then evaluate modal
  const handleUserLoginSuccess = (loggedInUser: any) => {
    resetAllUserState()
    localStorage.setItem('user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)

    const hasCompany = Boolean(loggedInUser.companyName && loggedInUser.companyName.trim() !== '' && loggedInUser.companyName !== 'N/A')
    const isVerified = Boolean(loggedInUser.isEmailVerified || loggedInUser.isNumberVerified)

    if (hasCompany && isVerified) {
      setShowVerifyModal(false)
    } else if (isVerified && !hasCompany) {
      setVerifyStep('company_input')
      setShowVerifyModal(true)
    } else {
      setVerifyStep('otp')
      setShowVerifyModal(true)
      handleResendOtp().catch(() => {})
    }
  }

  const handleResendOtp = async (type?: 'email' | 'mobile') => {
    try {
      const res = await sendOtpEmailServer({ data: { email: user?.email, type: type || 'email' } })
      if (res && res.message) {
        alert(res.message)
      }
    } catch (e: any) {
      alert(e?.message || 'Failed to dispatch OTP email.')
    }
  }

  // Initialize Google Identity Services
  const handleGoogleLogin = () => {
    if (window.google) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: "1055991339211-nfg42s9db9tj5oier9l64todfcnh5gdq.apps.googleusercontent.com",
        scope: "openid email profile",
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const userInfo = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`)
                .then(res => res.json())
              
              // Sync Google user profile details with the MongoDB database
              const syncRes = await syncGoogleUser({
                data: {
                  name: userInfo.name,
                  email: userInfo.email,
                  picture: userInfo.picture,
                }
              })
              
              if (syncRes && syncRes.success) {
                handleUserLoginSuccess(syncRes.user)
              }
            } catch (err) {
              console.error('Error fetching Google user info:', err)
            }
          }
        }
      })
      client.requestAccessToken()
    } else {
      alert("Google Sign-In SDK is loading. Please try again in a moment.")
    }
  }

  // Handle local credential login (MongoDB Authenticated)
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      alert("Please enter both email/phone and password.")
      return
    }
    
    try {
      const res = await loginUser({ data: { email, password } })
      if (res && res.success) {
        handleUserLoginSuccess(res.user)
      }
    } catch (err: any) {
      alert(err.message || "Failed to log in.")
    }
  }

  // Handle local signup (MongoDB Registered & Logged In)
  const handleLocalSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !mobileNumber || !signupEmail || !signupPassword || !confirmPassword) {
      alert("Please fill in all fields.")
      return
    }
    if (signupPassword !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    if (!agreeTerms) {
      alert("Please agree to the Terms of Service and Privacy Policy.")
      return
    }
    
    try {
      const res = await registerUser({
        data: {
          name: fullName,
          email: signupEmail,
          number: mobileNumber,
          companyName: signupCompany,
          password: signupPassword,
        }
      })
      if (res && res.success) {
        handleUserLoginSuccess(res.user)
      }
    } catch (err: any) {
      alert(err.message || "Failed to register account.")
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (e) {}
    localStorage.removeItem('user')
    setUser(null)
    resetAllUserState()
    setProfileDropdown(false)
    setActiveTab('dashboard')
  }

  // 1. LOADING SCREEN STATE
  if (loading) {
    return (
      <main className="fixed inset-0 w-screen h-screen flex flex-col justify-between items-center bg-gradient-to-b from-[#7c3aed] via-[#5b21b6] to-[#2e1065] text-white p-8 select-none font-sans z-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-violet-400/20 blur-[120px] pointer-events-none" />
        <div className="flex-1" />
        <div className="flex flex-col items-center justify-center text-center max-w-xs mx-auto">
          <img 
            src="/logo.png" 
            alt="TroxCard Logo" 
            className="w-48 sm:w-60 h-auto max-h-24 object-contain select-none pointer-events-none drop-shadow-md mb-2"
          />
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-white/95 mt-1">
            SHARE IN A TAP
          </p>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-center gap-4 mb-8">
          <div
            className="w-9 h-9 rounded-full border-[3px] border-white/20 border-t-white animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
          <span className="text-[10px] font-bold tracking-[0.25em] text-white/80 uppercase">
            LOADING...
          </span>
        </div>
      </main>
    )
  }

  // 2. LOGGED-IN HIGH FIDELITY DASHBOARD STATE (Ashwin Baby Mockup)
  if (user) {
    const cardSlug = user.slug || user.email?.split('@')[0] || 'ashwin'
    const cardUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/c/${cardSlug}`
      : `https://troxcard.com/c/${cardSlug}`

    const copyToClipboard = async (text: string): Promise<boolean> => {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text)
          return true
        } catch (e) {}
      }
      try {
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        return successful
      } catch (err) {
        console.error('Fallback copy failed:', err)
        return false
      }
    }

    const handleDownloadQr = async () => {
      try {
        if (user?.email) {
          trackCardScan({ data: user.email }).catch(console.error)
          setCardMetrics(prev => ({ ...prev, scans: prev.scans + 1 }))
        }

        // Create high-resolution 1000x1000 canvas for Fancy QR Download
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const canvasSize = 1000
        canvas.width = canvasSize
        canvas.height = canvasSize

        if (!ctx) return

        // 1. Draw rounded card container
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(0, 0, canvasSize, canvasSize, 60)
        } else {
          ctx.rect(0, 0, canvasSize, canvasSize)
        }
        ctx.fill()

        // 2. Draw gradient header banner
        const gradient = ctx.createLinearGradient(0, 0, canvasSize, 0)
        gradient.addColorStop(0, '#7c3aed')
        gradient.addColorStop(1, '#5b21b6')
        ctx.fillStyle = gradient
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(40, 40, canvasSize - 80, 160, 40)
        } else {
          ctx.rect(40, 40, canvasSize - 80, 160)
        }
        ctx.fill()

        // Header Text
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 44px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(cardFullName || user.name || 'Digital Business Card', canvasSize / 2, 115)
        ctx.font = '500 28px sans-serif'
        ctx.fillStyle = '#e9d5ff'
        ctx.fillText('SCAN TO CONNECT ON TROXCARD', canvasSize / 2, 160)

        // 3. Draw Fancy QR Code in center
        const qr = QRCode.create(cardUrl, { errorCorrectionLevel: 'H' })
        const count = qr.modules.size
        const data = qr.modules.data

        const qrAreaSize = 640
        const qrOffsetX = (canvasSize - qrAreaSize) / 2
        const qrOffsetY = 240
        const cellSize = qrAreaSize / count

        const centerStart = Math.floor(count / 2) - 3
        const centerEnd = Math.floor(count / 2) + 3

        const isEye = (r: number, c: number) => {
          if (r < 7 && c < 7) return true
          if (r < 7 && c >= count - 7) return true
          if (r >= count - 7 && c < 7) return true
          return false
        }

        const isCenter = (r: number, c: number) => {
          return r >= centerStart && r <= centerEnd && c >= centerStart && c <= centerEnd
        }

        // Draw light background box
        ctx.fillStyle = '#f8fafc'
        ctx.beginPath()
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(qrOffsetX - 20, qrOffsetY - 20, qrAreaSize + 40, qrAreaSize + 40, 40)
        } else {
          ctx.rect(qrOffsetX - 20, qrOffsetY - 20, qrAreaSize + 40, qrAreaSize + 40)
        }
        ctx.fill()

        // Draw rounded modules
        ctx.fillStyle = '#7c3aed'
        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (data[r * count + c] && !isEye(r, c) && !isCenter(r, c)) {
              const x = qrOffsetX + c * cellSize
              const y = qrOffsetY + r * cellSize
              ctx.beginPath()
              if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(x + 1, y + 1, cellSize - 2, cellSize - 2, cellSize * 0.35)
              } else {
                ctx.rect(x + 1, y + 1, cellSize - 2, cellSize - 2)
              }
              ctx.fill()
            }
          }
        }

        // Draw Corner Eyes
        const drawEye = (r: number, c: number) => {
          const eyeX = qrOffsetX + c * cellSize
          const eyeY = qrOffsetY + r * cellSize
          const eyeW = 7 * cellSize

          ctx.strokeStyle = '#6d28d9'
          ctx.lineWidth = cellSize * 0.9
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(eyeX + 3, eyeY + 3, eyeW - 6, eyeW - 6, cellSize * 1.8)
          } else {
            ctx.rect(eyeX + 3, eyeY + 3, eyeW - 6, eyeW - 6)
          }
          ctx.stroke()

          ctx.fillStyle = '#6d28d9'
          ctx.beginPath()
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(eyeX + 2 * cellSize + 2, eyeY + 2 * cellSize + 2, 3 * cellSize - 4, 3 * cellSize - 4, cellSize * 0.9)
          } else {
            ctx.rect(eyeX + 2 * cellSize + 2, eyeY + 2 * cellSize + 2, 3 * cellSize - 4, 3 * cellSize - 4)
          }
          ctx.fill()
        }

        drawEye(0, 0)
        drawEye(0, count - 7)
        drawEye(count - 7, 0)

        // Draw Center Logo Badge
        const centerX = canvasSize / 2
        const centerY = qrOffsetY + qrAreaSize / 2
        const logoR = (7 * cellSize) / 2

        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(centerX, centerY, logoR, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#7c3aed'
        ctx.beginPath()
        ctx.arc(centerX, centerY, logoR - 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.font = '900 48px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('K', centerX, centerY + 3)

        // Footer text
        ctx.fillStyle = '#94a3b8'
        ctx.font = 'bold 24px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('POWERED BY TROXCARD.COM', canvasSize / 2, 940)

        const a = document.createElement('a')
        a.href = canvas.toDataURL('image/png')
        a.download = `${user.name?.replace(/\s+/g, '_') || 'TroxCard'}_Fancy_QR.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (err) {
        console.error(err)
        alert('Could not download QR code.')
      }
    }

    const handleShareCard = () => {
      if (user?.email) {
        trackCardShare({ data: user.email }).catch(console.error)
        setCardMetrics(prev => ({ ...prev, shares: prev.shares + 1 }))
      }
      setShowShareModal(true)
    }

    return (
      <main className="fixed inset-0 w-screen h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800 overflow-hidden select-none">
        
        {/* Scrollable Area */}
        <div 
          ref={mainScrollRef}
          onScroll={handleMainScroll}
          className="flex-1 overflow-y-auto pb-24 relative bg-[#4c1d95] scrollbar-none"
        >
          {/* Sticky Header Top Bar - Transparent when not scrolled, dark purple glassmorphic when scrolled */}
          <div className={`sticky top-0 z-40 px-6 pt-3.5 pb-3.5 flex items-center justify-between transition-all duration-300 ${
            isHeaderScrolled 
              ? 'bg-[#3b0764]/98 backdrop-blur-md border-b border-purple-900/40 shadow-lg text-white' 
              : 'bg-transparent text-white border-b border-transparent shadow-none'
          }`}>
            <img 
              src="/logo.png" 
              alt="TroxCard Logo" 
              className="h-8 sm:h-9 w-auto select-none pointer-events-none drop-shadow-sm"
            />
            <div className="flex items-center gap-3">
              {/* Notifications Alert Button */}
              <button className="relative p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition text-white border-none bg-transparent cursor-pointer">
                <Bell size={22} />
                <span className="absolute top-0 right-0 w-4 h-4 bg-purple-500 rounded-full text-[9px] font-extrabold flex items-center justify-center border-2 border-[#5b21b6]">
                  3
                </span>
              </button>
              
              {/* User Dropdown Profile Icon Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileDropdown(prev => !prev)}
                  className="w-9.5 h-9.5 rounded-full overflow-hidden border-2 border-white/30 bg-violet-950 flex items-center justify-center cursor-pointer active:scale-95 transition shadow-sm"
                >
                  {user.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold uppercase text-white">
                      {user.name?.charAt(0)}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown Menu - Bigger w-64 card */}
                {profileDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2.5 z-50 text-slate-700 animate-fade-in">
                    {/* User Header Block */}
                    <div className="p-3 bg-violet-50/70 rounded-xl mb-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-purple-200 bg-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold truncate text-slate-800">{user.name}</p>
                        <p className="text-[10px] font-semibold text-slate-400 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-violet-100 text-[#7c3aed] text-[9px] font-bold">
                          Active Member
                        </span>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col gap-1">
                      {/* Edit Profile Details Option */}
                      <button 
                        onClick={() => {
                          setProfileDropdown(false)
                          setEditName(user.name || '')
                          setEditEmail(user.email || '')
                          setEditPhone(user.number || '')
                          setEditCompany(user.companyName || '')
                          setEditProfileModal(true)
                        }}
                        className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-violet-50 hover:text-[#7c3aed] rounded-xl flex items-center justify-between transition border-none bg-transparent cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-violet-100 text-[#7c3aed]">
                            <Edit2 size={14} />
                          </div>
                          <span>Edit Profile Details</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-400" />
                      </button>

                      {/* Log Out Session Option */}
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-between transition border-none bg-transparent cursor-pointer border-t border-slate-100 pt-2.5 mt-0.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-red-100 text-red-500">
                            <LogOut size={14} />
                          </div>
                          <span>Log Out Session</span>
                        </div>
                        <ChevronRight size={14} className="text-slate-300" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Header Wave Gradient */}
          <div className="bg-gradient-to-b from-[#1b073c] via-[#2d0a5a] to-[#4c1d95] text-white pb-16 px-6 -mt-16 pt-18 rounded-b-[2.5rem] relative shadow-lg">

            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-violet-400/20 blur-[80px] pointer-events-none" />

            {/* Greetings */}
            <div className="mt-3 z-10 relative max-w-[85%]">
              <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight">
                Welcome back, {user.name?.split(' ')[0] || 'Ashwin'} 👋
              </h1>
              <p className="text-xs text-purple-200/80 mt-1 leading-snug">
                Here's what's happening with your card today.
              </p>
            </div>
          </div>

          {/* Floating Featured Business Card with Theme-Blended Design */}
          <div className="px-6 -mt-12 relative z-20">
            <div className="w-full bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7e22ce] rounded-[2rem] p-5 shadow-2xl text-white relative overflow-hidden flex flex-col justify-between h-48 border border-white/20">
              
              {/* Theme Ambient Glow Blobs */}
              <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-purple-400/25 blur-[50px] pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-indigo-500/20 blur-[45px] pointer-events-none" />

              {/* Decorative Theme Waves SVG Overlay */}
              <svg 
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none mix-blend-overlay"
                viewBox="0 0 400 200" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="350" cy="40" r="140" stroke="white" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M-50 160 C 100 80, 200 220, 450 100" stroke="white" strokeWidth="2" />
                <path d="M-20 190 C 120 110, 220 250, 470 130" stroke="white" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx="80" cy="180" r="90" stroke="white" strokeWidth="1" opacity="0.6" />
              </svg>

              {/* Top Row */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-3">
                  {/* Card Profile Picture with Green Checkmark Badge */}
                  <div className="w-14 h-14 rounded-full border border-white/30 bg-purple-400/30 flex items-center justify-center font-bold text-xl text-white relative shrink-0 shadow-sm">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase()
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-green-500 border-2 border-[#5b21b6] flex items-center justify-center text-white shadow-sm">
                      <Check size={10} strokeWidth={3.5} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-white truncate max-w-[180px]">{cardFullName || user.name}</h2>
                    <p className="text-xs text-purple-200 font-medium truncate">{cardJobTitle || 'Software Developer'}</p>
                    <p className="text-xs text-purple-300/80 font-normal truncate">{cardCompany || user.companyName || 'Kodeversity'}</p>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex justify-between items-end z-10">
                <div className="flex items-center gap-2">
                  <Wifi size={16} className="rotate-90 text-white/80" />
                  <span className="text-xs text-white/90 font-medium">Tap or share your card</span>
                </div>

                {/* Transparent Real QR Code Container (No White Box) */}
                <a 
                  href={cardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Open business card: ${cardUrl}`}
                  className="w-18 h-18 flex items-center justify-center shrink-0 hover:scale-105 transition cursor-pointer"
                >
                  <QRCodeImage 
                    value={cardUrl} 
                    darkColor="#ffffff" 
                    lightColor="#00000000" 
                    className="w-full h-full" 
                  />
                </a>
              </div>
            </div>
          </div>

          {/* MAIN ACTIONS & STATS */}
          <div className="bg-[#f8fafc] -mt-10 pt-14 pb-24 min-h-screen px-6 flex flex-col gap-6">

            {/* Total Views Analytics Card with Mini Bar Chart */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100/90 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                {/* Left Side Metrics */}
                <div className="flex flex-col">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center mb-2">
                    <Eye size={18} />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Total Views</span>
                  <span className="text-2xl font-extrabold text-slate-800 my-0.5">{cardMetrics.views}</span>
                  <span className="text-xs font-bold text-green-600">↑ 18% <span className="text-slate-400 font-normal">this week</span></span>
                </div>

                {/* Right Side Mini Bar Chart */}
                <div className="flex items-end gap-2.5 pt-2">
                  {[
                    { day: 'M', height: 'h-7' },
                    { day: 'T', height: 'h-4' },
                    { day: 'W', height: 'h-9' },
                    { day: 'T', height: 'h-5' },
                    { day: 'F', height: 'h-7' },
                    { day: 'S', height: 'h-11' },
                    { day: 'S', height: 'h-8' },
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <div className={`w-2 ${bar.height} bg-[#7c3aed] rounded-full transition-all`} />
                      <span className="text-[10px] text-slate-400 font-semibold">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button 
                  onClick={handleShareCard}
                  className="flex-1 py-2.5 px-3 border border-purple-200 text-[#7c3aed] bg-purple-50/40 hover:bg-purple-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                >
                  <Upload size={14} /> Share Card
                </button>
                <button 
                  onClick={handleDownloadQr}
                  className="flex-1 py-2.5 px-3 border border-purple-200 text-[#7c3aed] bg-purple-50/40 hover:bg-purple-50 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                >
                  <Download size={14} /> Download QR
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800">Quick Actions</h3>
                <a href="#" onClick={e => e.preventDefault()} className="text-xs font-bold text-[#7c3aed] hover:underline no-underline">View All</a>
              </div>
              
              {/* Side-Scrollable Container */}
              <div 
                ref={quickActionsRef}
                onScroll={handleQuickActionsScroll}
                className="flex overflow-x-auto gap-3.5 pb-2 pt-1 scrollbar-none snap-x snap-mandatory -mx-6 px-6"
              >
                {[
                  { label: 'Edit Card', desc: 'Update details', icon: <Contact size={20} />, bg: 'bg-purple-50', text: 'text-[#7c3aed]' },
                  { label: 'Payment', desc: 'UPI & Payment', icon: <CreditCard size={20} />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
                  { label: 'Analytics', desc: 'View insights', icon: <BarChart3 size={20} />, bg: 'bg-violet-50', text: 'text-violet-600' },
                  { label: 'Save QR', desc: 'Save to gallery', icon: <Download size={20} />, bg: 'bg-amber-50', text: 'text-amber-600' },
                  { label: 'NFC Tap', desc: 'Tap to connect', icon: <QrCode size={20} />, bg: 'bg-blue-50', text: 'text-blue-600' },
                  { label: 'Themes', desc: 'Custom styles', icon: <Settings size={20} />, bg: 'bg-rose-50', text: 'text-rose-600' },
                ].map((act, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      if (act.label === 'Edit Card') setCreateModal(true)
                      else if (act.label === 'Payment') setShowPayModal(true)
                      else if (act.label === 'Save QR') handleDownloadQr()
                      else if (act.label === 'Themes') { setEditCardStep(4); setCreateModal(true) }
                    }}
                    className="bg-white rounded-2xl p-3 border border-slate-100/90 flex flex-col items-center text-center shadow-sm hover:shadow-md active:scale-95 transition cursor-pointer min-w-[105px] h-[105px] shrink-0 snap-center"
                  >
                    <div className={`p-2.5 rounded-2xl ${act.bg} ${act.text} mb-1.5`}>
                      {act.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-800 leading-tight whitespace-nowrap">{act.label}</span>
                    <span className="text-[9px] text-slate-400 font-medium mt-0.5 truncate w-full">{act.desc}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Quick Actions Scroll Indicator Dots */}
              <div className="flex justify-center items-center gap-1.5 mt-2">
                {[0, 1, 2].map((idx) => (
                  <span 
                    key={idx}
                    className={`transition-all duration-300 rounded-full ${
                      quickActionsActiveIndex === idx 
                        ? 'w-4 h-1.5 bg-[#7c3aed]' 
                        : 'w-1.5 h-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Your Overview (2x2 Grid) */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800">Your Overview</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3.5">
                {/* Card 1: Total Views (Purple) */}
                <div className="bg-[#f5f3ff] border border-purple-100/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7c3aed] flex items-center justify-center">
                      <Eye size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-100/80 px-2 py-0.5 rounded-full">↑ 18%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xl font-black text-slate-800">{cardMetrics.views}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Total Views</p>
                  </div>
                </div>

                {/* Card 2: New Contacts (Green) */}
                <div className="bg-[#f0fdf4] border border-green-100/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                      <UserPlus size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-100/80 px-2 py-0.5 rounded-full">↑ 12%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xl font-black text-slate-800">{cardMetrics.contactsSaved}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">New Contacts</p>
                  </div>
                </div>

                {/* Card 3: Shares (Peach/Orange) */}
                <div className="bg-[#fff7ed] border border-orange-100/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Share2 size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-100/80 px-2 py-0.5 rounded-full">↑ 15%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xl font-black text-slate-800">{cardMetrics.shares}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Shares</p>
                  </div>
                </div>

                {/* Card 4: QR Scans (Blue) */}
                <div className="bg-[#eff6ff] border border-blue-100/60 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <Download size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-green-600 bg-green-100/80 px-2 py-0.5 rounded-full">↑ 20%</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xl font-black text-slate-800">{cardMetrics.scans}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">QR Scans</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
                <a href="#" onClick={e => e.preventDefault()} className="text-xs font-bold text-[#7c3aed] hover:underline no-underline">View All</a>
              </div>
              <div className="bg-white border border-slate-100 rounded-3xl shadow-sm divide-y divide-slate-100 overflow-hidden">
                {[
                  { text: 'Your card was viewed by', bold: 'Rahul Sharma', time: '2m ago', color: 'bg-purple-50 text-[#7c3aed]', icon: <Eye size={16} /> },
                  { text: 'New contact added', bold: 'Priya Nair', time: '15m ago', color: 'bg-green-50 text-green-600', icon: <UserPlus size={16} /> },
                  { text: 'Your card was shared via WhatsApp', bold: '', time: '1h ago', color: 'bg-orange-50 text-orange-600', icon: <Share2 size={16} /> },
                ].map((act, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${act.color}`}>
                        {act.icon}
                      </div>
                      <div>
                        <p className="text-xs text-slate-600 font-medium">
                          {act.text} {act.bold && <span className="font-extrabold text-slate-800">{act.bold}</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{act.time}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-2xl py-3 px-6 flex items-center justify-between rounded-t-[1.75rem] z-40 max-w-sm mx-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
            { id: 'contacts', label: 'Contacts', icon: <Users size={20} /> },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer transition ${activeTab === tab.id ? 'text-[#7c3aed]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.icon}
              <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
            </button>
          ))}

          {/* Plus Floating Action Button */}
          <div className="relative -mt-8 flex justify-center">
            <button 
              onClick={() => setCreateModal(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#5b21b6] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 active:scale-95 border-none cursor-pointer transition"
            >
              <Plus size={28} />
            </button>
          </div>

          {[
            { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
            { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-col items-center gap-1 border-none bg-transparent cursor-pointer transition ${activeTab === tab.id ? 'text-[#7c3aed]' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab.icon}
              <span className="text-[9px] font-bold tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* EDIT CARD FULL FORM MODAL / DRAWER (Screenshot Match) */}
        {createModal && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in overflow-y-auto">
            <div className="w-full max-w-md bg-white rounded-[2rem] p-5 sm:p-6 shadow-2xl relative animate-scale-up border border-purple-100 my-auto text-left max-h-[92vh] overflow-y-auto scrollbar-none">
              
              {/* Header Top Area */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      if (editCardStep > 1) setEditCardStep(prev => prev - 1)
                      else setCreateModal(false)
                    }}
                    className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border-none cursor-pointer transition shrink-0 active:scale-95"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">Edit Card</h3>
                    <p className="text-xs text-slate-400 font-normal">Update your card details</p>
                  </div>
                </div>

                {/* Top Right Close Button */}
                <button 
                  onClick={() => setCreateModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center border-none cursor-pointer transition shrink-0 active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              {/* 4-Step Wizard Stepper */}
              <div className="flex items-center justify-between my-5 px-1 relative">
                {[
                  { num: 1, label: 'Profile' },
                  { num: 2, label: 'Contact' },
                  { num: 3, label: 'Content' },
                  { num: 4, label: 'Theme' },
                ].map((step) => (
                  <div key={step.num} className="flex flex-col items-center z-10">
                    <button 
                      onClick={() => setEditCardStep(step.num)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition border-none cursor-pointer ${
                        editCardStep === step.num
                          ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-500/30'
                          : editCardStep > step.num
                          ? 'bg-[#7c3aed] text-white'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}
                    >
                      {editCardStep > step.num ? <Check size={14} strokeWidth={3.5} /> : step.num}
                    </button>
                    <span className={`text-[10px] font-semibold mt-1 ${
                      editCardStep >= step.num ? 'text-[#7c3aed]' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
                {/* Connecting hairline */}
                <div className="absolute top-3.5 left-6 right-6 h-[1.5px] bg-slate-200 -z-0" />
              </div>

              {/* STEP 1: PROFILE FORM VIEW */}
              {editCardStep === 1 && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  {/* PROFILE PHOTO UPLOADER CARD */}
                  <div className="border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-2xl p-4 flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7c3aed] flex items-center justify-center shrink-0">
                        <Camera size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">Profile Photo</h4>
                        <p className="text-[10px] text-slate-400 font-medium leading-tight">
                          Upload your photo or logo <br /> PNG, JPG up to 5MB
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Photo uploader launched.")}
                      className="border border-purple-200 bg-white hover:bg-purple-50 text-[#7c3aed] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm cursor-pointer transition shrink-0"
                    >
                      Upload
                    </button>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input 
                        type="text"
                        value={cardFullName}
                        onChange={e => setCardFullName(e.target.value)}
                        placeholder="Ashwin Baby"
                        className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* 2-Column Row: Job Title & Company */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Job Title</label>
                      <div className="relative flex items-center">
                        <Briefcase className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input 
                          type="text"
                          value={cardJobTitle}
                          onChange={e => setCardJobTitle(e.target.value)}
                          placeholder="Software Developer"
                          className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Company</label>
                      <div className="relative flex items-center">
                        <Building className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                        <input 
                          type="text"
                          value={cardCompany}
                          onChange={e => setCardCompany(e.target.value)}
                          placeholder="Kodeversity"
                          className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tagline / Bio */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Tagline / Bio</label>
                    <div className="relative">
                      <Quote className="absolute left-3.5 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
                      <textarea 
                        rows={3}
                        maxLength={120}
                        value={cardBio}
                        onChange={e => setCardBio(e.target.value)}
                        placeholder="Building digital solutions that make an impact."
                        className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition resize-none"
                      />
                      <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-medium">
                        {cardBio.length}/120
                      </span>
                    </div>
                  </div>

                  {/* Save & Continue */}
                  <button 
                    disabled={isSavingCard}
                    onClick={async () => {
                      await handleSaveCardDetails()
                      setEditCardStep(2)
                    }}
                    className="w-full py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
                  >
                    {isSavingCard ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>

                  <button 
                    disabled={isSavingCard}
                    onClick={async () => {
                      await handleSaveCardDetails()
                      setCreateModal(false)
                    }}
                    className="w-full text-center text-xs font-bold text-[#7c3aed] hover:underline bg-transparent border-none cursor-pointer py-1"
                  >
                    Save as Draft
                  </button>
                </div>
              )}

              {/* STEP 2: CONTACT FORM VIEW (Exact Screenshot Match!) */}
              {editCardStep === 2 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  
                  {/* SECTION 1: CONTACT INFORMATION */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Contact Information</h4>
                    <p className="text-xs text-slate-400 font-normal mt-0.5 mb-3">Add your contact details and social links</p>

                    <div className="flex flex-col gap-3">
                      {/* 2-Column Row: Phone & Email */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-medium mb-1 block">Phone Number</label>
                          <div className="relative flex items-center">
                            <Phone className="absolute left-3.5 text-purple-600 w-4 h-4 pointer-events-none" />
                            <input 
                              type="text"
                              value={cardPhone}
                              onChange={e => setCardPhone(e.target.value)}
                              placeholder="+91 7356 567 890"
                              className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-medium mb-1 block">Email Address</label>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-3.5 text-purple-600 w-4 h-4 pointer-events-none" />
                            <input 
                              type="email"
                              value={cardEmail}
                              onChange={e => setCardEmail(e.target.value)}
                              placeholder="ashwin@kodeversity.com"
                              className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Full Width: Website */}
                      <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1 block">Website</label>
                        <div className="relative flex items-center">
                          <Globe className="absolute left-3.5 text-purple-600 w-4 h-4 pointer-events-none" />
                          <input 
                            type="text"
                            value={cardWebsite}
                            onChange={e => setCardWebsite(e.target.value)}
                            placeholder="https://kodeversity.com"
                            className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Full Width: Location */}
                      <div>
                        <label className="text-[10px] text-slate-400 font-medium mb-1 block">Location</label>
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-3.5 text-purple-600 w-4 h-4 pointer-events-none" />
                          <input 
                            type="text"
                            value={cardLocation}
                            onChange={e => setCardLocation(e.target.value)}
                            placeholder="Kerala, India"
                            className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                          />
                        </div>
                      </div>

                      {/* Show Contact Information Toggle */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between my-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-purple-100/70 text-[#7c3aed]">
                            <Eye size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">Show Contact Information on Card</h5>
                            <p className="text-[10px] text-slate-400 font-normal">Your contact details will be visible to others</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setShowContactInfo(prev => !prev)}
                          className={`w-11 h-6 rounded-full transition-colors p-0.5 border-none cursor-pointer flex items-center shrink-0 ${
                            showContactInfo ? 'bg-[#7c3aed]' : 'bg-slate-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                            showContactInfo ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>

                    </div>
                  </div>

                  {/* SECTION 2: SOCIAL MEDIA LINKS */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Social Media Links</h4>
                    <p className="text-xs text-slate-400 font-normal mt-0.5 mb-3">Add your social media profiles</p>

                    <div className="flex flex-col gap-3">
                      {/* Instagram */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <InstagramIcon size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-20 shrink-0">Instagram</span>
                        <input 
                          type="text"
                          value={cardInstagram}
                          onChange={e => setCardInstagram(e.target.value)}
                          placeholder="https://instagram.com/username"
                          className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 outline-none transition"
                        />
                      </div>

                      {/* WhatsApp */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <MessageCircle size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-20 shrink-0">WhatsApp</span>
                        <input 
                          type="text"
                          value={cardWhatsapp}
                          onChange={e => setCardWhatsapp(e.target.value)}
                          placeholder="https://wa.me/number"
                          className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 outline-none transition"
                        />
                      </div>

                      {/* Facebook */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <FacebookIcon size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-20 shrink-0">Facebook</span>
                        <input 
                          type="text"
                          value={cardFacebook}
                          onChange={e => setCardFacebook(e.target.value)}
                          placeholder="https://facebook.com/username"
                          className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 outline-none transition"
                        />
                      </div>

                      {/* LinkedIn */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-sky-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <LinkedinIcon size={20} />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-20 shrink-0">LinkedIn</span>
                        <input 
                          type="text"
                          value={cardLinkedin}
                          onChange={e => setCardLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2 px-3 text-xs font-medium text-slate-800 outline-none transition"
                        />
                      </div>

                      {/* Dashed Button: + Add Other Social Link */}
                      <button 
                        onClick={() => alert("Social link picker launched.")}
                        className="border-2 border-dashed border-purple-200 bg-purple-50/40 hover:bg-purple-50 rounded-2xl p-3 text-center text-xs font-bold text-[#7c3aed] cursor-pointer transition flex items-center justify-center gap-1.5 mt-1"
                      >
                        <Plus size={16} />
                        <span>Add Other Social Link</span>
                      </button>
                    </div>
                  </div>

                  {/* SECTION 3: ADDITIONAL CONTACT OPTIONS */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Additional Contact Options</h4>
                    <p className="text-xs text-slate-400 font-normal mt-0.5 mb-3">Add more ways to reach you</p>

                    <div className="flex flex-col gap-3">
                      {/* 2-Column Row: Alternate Phone & Fax */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 font-medium mb-1 block">
                            Alternate Phone <span className="text-slate-300">(Optional)</span>
                          </label>
                          <div className="relative flex items-center">
                            <Phone className="absolute left-3.5 text-purple-600 w-4 h-4 pointer-events-none" />
                            <input 
                              type="text"
                              value={cardAltPhone}
                              onChange={e => setCardAltPhone(e.target.value)}
                              placeholder="Enter alternate number"
                              className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-medium mb-1 block">
                            Fax <span className="text-slate-300">(Optional)</span>
                          </label>
                          <div className="relative flex items-center">
                            <Printer className="absolute left-3.5 text-purple-600 w-4 h-4 pointer-events-none" />
                            <input 
                              type="text"
                              value={cardFax}
                              onChange={e => setCardFax(e.target.value)}
                              placeholder="Enter fax number"
                              className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Full Width Row: Custom CTA (Optional) */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-purple-100/70 text-[#7c3aed]">
                            <Link size={18} />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">
                              Custom CTA <span className="text-slate-400 font-normal">(Optional)</span>
                            </h5>
                            <p className="text-[10px] text-slate-400 font-normal">e.g., Book a Meeting, View Portfolio</p>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-slate-400" />
                      </div>

                    </div>
                  </div>

                  {/* Primary & Secondary Buttons */}
                  <button 
                    disabled={isSavingCard}
                    onClick={async () => {
                      await handleSaveCardDetails()
                      setEditCardStep(3)
                    }}
                    className="w-full py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                  >
                    {isSavingCard ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>

                  <button 
                    disabled={isSavingCard}
                    onClick={async () => {
                      await handleSaveCardDetails()
                      setCreateModal(false)
                    }}
                    className="w-full text-center text-xs font-bold text-[#7c3aed] hover:underline bg-transparent border-none cursor-pointer py-1"
                  >
                    Save as Draft
                  </button>

                </div>
              )}

              {/* STEP 3: CONTENT FORM VIEW (Exact Screenshot Match!) */}
              {editCardStep === 3 && (
                <div className="flex flex-col gap-5 animate-fade-in">
                  
                  {/* Top Subtitle Text */}
                  <p className="text-xs text-slate-400 font-normal -mt-1 mb-1">
                    Add information about your business, services and how people can take action.
                  </p>

                  {/* SECTION 1: ABOUT YOU / BIO */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2">About You / Bio</h4>
                    <div className="relative">
                      <Quote className="absolute left-3.5 top-3.5 text-[#7c3aed] w-4 h-4 pointer-events-none" />
                      <textarea 
                        rows={3}
                        maxLength={200}
                        value={cardAboutBio}
                        onChange={e => setCardAboutBio(e.target.value)}
                        placeholder="We build digital solutions that help businesses grow and make an impact."
                        className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-2xl py-3 pl-10 pr-3 text-xs font-medium text-slate-800 outline-none transition resize-none leading-relaxed"
                      />
                      <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 font-medium">
                        {cardAboutBio.length}/200
                      </span>
                    </div>
                  </div>

                  {/* SECTION 2: BROCHURE / DOCUMENT */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Brochure / Document</h4>
                    <p className="text-xs text-slate-400 font-normal mt-0.5 mb-2.5">Upload your brochure or any document (PDF)</p>

                    <div className="border-2 border-dashed border-purple-200 bg-purple-50/40 rounded-2xl p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-purple-100/90 text-[#7c3aed] flex items-center justify-center shrink-0">
                          <FileText size={22} />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-800 truncate">{cardBrochureName}</h5>
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">PDF • {cardBrochureSize}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button 
                          type="button"
                          onClick={() => alert("Replace brochure PDF...")}
                          className="border border-purple-200 bg-white hover:bg-purple-50 text-[#7c3aed] font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm cursor-pointer transition flex items-center gap-1.5 shrink-0"
                        >
                          <Upload size={14} className="text-[#7c3aed]" />
                          <span>Change</span>
                        </button>
                        <button 
                          type="button"
                          onClick={() => alert("Brochure deleted")}
                          className="border border-purple-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: CALL TO ACTION BUTTON */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Call to Action Button</h4>
                    <p className="text-xs text-slate-400 font-normal mt-0.5 mb-3">Add a primary action for your visitors</p>

                    <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-4 flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-purple-100/90 text-[#7c3aed] flex items-center justify-center shrink-0">
                        <MousePointerClick size={20} />
                      </div>

                      <div className="flex flex-col gap-3 flex-1">
                        <div>
                          <label className="text-[10px] text-slate-400 font-medium mb-1 block">Button Text</label>
                          <input 
                            type="text"
                            value={cardCtaText}
                            onChange={e => setCardCtaText(e.target.value)}
                            placeholder="Book a Meeting"
                            className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 px-3 text-xs font-medium text-slate-800 outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-medium mb-1 block">Button Link</label>
                          <div className="relative flex items-center">
                            <input 
                              type="text"
                              value={cardCtaLink}
                              onChange={e => setCardCtaLink(e.target.value)}
                              placeholder="https://calendly.com/ashwin/meet"
                              className="w-full bg-white border border-slate-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-3 pr-9 text-xs font-medium text-slate-800 outline-none transition"
                            />
                            <Link size={14} className="absolute right-3 text-[#7c3aed] pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: LOCATION INFORMATION */}
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Location Information</h4>
                    <p className="text-xs text-slate-400 font-normal mt-0.5 mb-3">Add your business location details</p>

                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col divide-y divide-slate-100">
                      
                      {/* Row 1: Address */}
                      <div className="p-3.5 flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-purple-100/70 text-[#7c3aed] shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div className="flex-1">
                          <label className="text-[10px] text-slate-400 font-medium block">Address</label>
                          <input 
                            type="text"
                            value={cardAddress}
                            onChange={e => setCardAddress(e.target.value)}
                            placeholder="Kochi, Kerala, India"
                            className="w-full text-xs font-semibold text-slate-800 outline-none border-none bg-transparent p-0"
                          />
                        </div>
                      </div>

                      {/* Row 2: Country & State/Province */}
                      <div className="grid grid-cols-2 divide-x divide-slate-100">
                        <div className="p-3.5 flex items-center gap-2.5 relative">
                          <div className="p-1.5 rounded-lg bg-purple-100/50 text-[#7c3aed] shrink-0">
                            <Globe size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="text-[10px] text-slate-400 font-medium block">Country</label>
                            <select 
                              value={cardCountry}
                              onChange={e => setCardCountry(e.target.value)}
                              className="w-full text-xs font-semibold text-slate-800 outline-none border-none bg-transparent appearance-none cursor-pointer pr-4"
                            >
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Arab Emirates">United Arab Emirates</option>
                            </select>
                          </div>
                          <ChevronDown size={14} className="text-slate-400 absolute right-3 pointer-events-none" />
                        </div>

                        <div className="p-3.5 flex items-center justify-between relative">
                          <div className="flex-1 min-w-0">
                            <label className="text-[10px] text-slate-400 font-medium block">State / Province</label>
                            <select 
                              value={cardState}
                              onChange={e => setCardState(e.target.value)}
                              className="w-full text-xs font-semibold text-slate-800 outline-none border-none bg-transparent appearance-none cursor-pointer pr-4"
                            >
                              <option value="Kerala">Kerala</option>
                              <option value="Karnataka">Karnataka</option>
                              <option value="Maharashtra">Maharashtra</option>
                            </select>
                          </div>
                          <ChevronDown size={14} className="text-slate-400 absolute right-3 pointer-events-none" />
                        </div>
                      </div>

                      {/* Row 3: City & PIN / Postal Code */}
                      <div className="grid grid-cols-2 divide-x divide-slate-100">
                        <div className="p-3.5 flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-purple-100/50 text-[#7c3aed] shrink-0">
                            <Building size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <label className="text-[10px] text-slate-400 font-medium block">City</label>
                            <input 
                              type="text"
                              value={cardCity}
                              onChange={e => setCardCity(e.target.value)}
                              placeholder="Kochi"
                              className="w-full text-xs font-semibold text-slate-800 outline-none border-none bg-transparent p-0"
                            />
                          </div>
                        </div>

                        <div className="p-3.5">
                          <label className="text-[10px] text-slate-400 font-medium block">PIN / Postal Code</label>
                          <input 
                            type="text"
                            value={cardPinCode}
                            onChange={e => setCardPinCode(e.target.value)}
                            placeholder="682018"
                            className="w-full text-xs font-semibold text-slate-800 outline-none border-none bg-transparent p-0"
                          />
                        </div>
                      </div>

                      {/* Row 4: Embedded Location Map Graphic */}
                      <div className="p-2 bg-slate-50 relative h-36 overflow-hidden">
                        <div className="w-full h-full rounded-xl bg-slate-200 overflow-hidden relative border border-slate-200/80 shadow-inner">
                          {/* Map Tiles Vector Graphic */}
                          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 opacity-80">
                            <defs>
                              <pattern id="mapPattern" width="120" height="120" patternUnits="userSpaceOnUse">
                                <rect width="120" height="120" fill="#e2e8f0"/>
                                <path d="M0 40 Q 60 20 120 40 T 240 40" fill="none" stroke="#cbd5e1" strokeWidth="12"/>
                                <path d="M40 0 Q 20 60 40 120 T 40 240" fill="none" stroke="#bae6fd" strokeWidth="18"/>
                                <path d="M0 90 L 120 90" stroke="#fde68a" strokeWidth="6"/>
                                <path d="M90 0 L 90 120" stroke="#fde68a" strokeWidth="6"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#mapPattern)"/>
                          </svg>

                          {/* Waterway Vector */}
                          <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-sky-200/80 border-r-2 border-sky-300/50" />

                          {/* Map Pin Marker */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 animate-bounce">
                            <div className="w-8 h-8 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shadow-lg shadow-purple-500/40 border-2 border-white">
                              <MapPin size={18} fill="#7c3aed" />
                            </div>
                            <span className="bg-slate-900/90 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-md mt-0.5 tracking-wide">
                              Kochi
                            </span>
                          </div>

                          {/* Location Labels */}
                          <span className="absolute top-3 right-4 text-[9px] font-bold text-slate-500">Palarivattom</span>
                          <span className="absolute bottom-3 left-40 text-[9px] font-bold text-slate-500">Kadavanthra</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Primary & Secondary Buttons */}
                  <button 
                    disabled={isSavingCard}
                    onClick={async () => {
                      await handleSaveCardDetails()
                      setEditCardStep(4)
                    }}
                    className="w-full py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-md cursor-pointer transition text-xs flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
                  >
                    {isSavingCard ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <span>Save & Continue</span>
                        <ChevronRight size={16} />
                      </>
                    )}
                  </button>

                  <button 
                    disabled={isSavingCard}
                    onClick={async () => {
                      await handleSaveCardDetails()
                      setCreateModal(false)
                    }}
                    className="w-full text-center text-xs font-bold text-[#7c3aed] hover:underline bg-transparent border-none cursor-pointer py-1"
                  >
                    Save as Draft
                  </button>

                </div>
              )}

              {/* STEP 4: THEME SELECTION VIEW (Screenshot Match) */}
              {editCardStep === 4 && (
                <div className="flex flex-col gap-4 animate-fade-in text-left">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Choose Your Theme</h4>
                    <p className="text-xs text-slate-400 font-normal mt-0.5">Select a design that represents you and your brand</p>
                  </div>

                  {/* MINI CARD THEMES GRID (Standard + Paid ₹99 Themes) */}
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { 
                        id: 'theme1', 
                        name: 'Purple Luxe', 
                        isPro: false,
                        bg: 'bg-slate-950 text-white', 
                        logoColor: 'text-amber-400',
                        accent: 'bg-amber-400/20 border-amber-400/40',
                        btnBg: 'bg-amber-500/20 text-amber-300'
                      },
                      { 
                        id: 'theme2', 
                        name: 'Midnight', 
                        isPro: false,
                        bg: 'bg-gradient-to-b from-[#f3e8ff] via-[#faf5ff] to-white text-slate-800', 
                        logoColor: 'text-[#7c3aed]',
                        accent: 'bg-purple-100/50 border-purple-200',
                        btnBg: 'bg-purple-100 text-[#7c3aed]'
                      },
                      { 
                        id: 'theme3', 
                        name: 'Emerald', 
                        isPro: false,
                        bg: 'bg-gradient-to-b from-[#0a192f] via-[#0f2942] to-[#030712] text-white', 
                        logoColor: 'text-sky-400',
                        accent: 'bg-sky-400/20 border-sky-400/40',
                        btnBg: 'bg-sky-500/20 text-sky-300'
                      },
                      { 
                        id: 'theme4', 
                        name: 'Sapphire', 
                        isPro: false,
                        bg: 'bg-gradient-to-b from-emerald-600 via-emerald-500 to-emerald-50 text-slate-800', 
                        logoColor: 'text-emerald-800 font-black',
                        accent: 'bg-emerald-100/60 border-emerald-200',
                        btnBg: 'bg-emerald-100 text-emerald-700'
                      },
                      { 
                        id: 'theme5', 
                        name: 'Rose Gold', 
                        isPro: false,
                        bg: 'bg-gradient-to-b from-orange-500 via-rose-400 to-orange-50 text-slate-800', 
                        logoColor: 'text-orange-900 font-black',
                        accent: 'bg-orange-100/60 border-orange-200',
                        btnBg: 'bg-orange-100 text-orange-700'
                      },
                      { 
                        id: 'theme6', 
                        name: 'Minimal White', 
                        isPro: false,
                        bg: 'bg-white text-slate-800 border border-slate-100', 
                        logoColor: 'text-[#7c3aed]',
                        accent: 'bg-purple-50 border-purple-100',
                        btnBg: 'bg-purple-50 text-[#7c3aed]'
                      },
                      /* PAID PRO THEMES (₹99) */
                      { 
                        id: 'pro_gold', 
                        name: 'Obsidian Gold', 
                        isPro: true,
                        price: '₹99',
                        bg: 'bg-gradient-to-b from-[#18181b] via-[#27272a] to-[#09090b] text-amber-300 border border-amber-500/40', 
                        logoColor: 'text-amber-400',
                        accent: 'bg-amber-400/20 border-amber-400/40',
                        btnBg: 'bg-amber-500/20 text-amber-300'
                      },
                      { 
                        id: 'pro_cyber', 
                        name: 'Neon Cyber', 
                        isPro: true,
                        price: '₹99',
                        bg: 'bg-gradient-to-b from-[#090d16] via-[#111827] to-[#030712] text-cyan-300 border border-cyan-500/40', 
                        logoColor: 'text-cyan-400',
                        accent: 'bg-cyan-400/20 border-cyan-400/40',
                        btnBg: 'bg-cyan-500/20 text-cyan-300'
                      },
                      { 
                        id: 'pro_platinum', 
                        name: 'Platinum Glass', 
                        isPro: true,
                        price: '₹99',
                        bg: 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 text-slate-900 border border-white', 
                        logoColor: 'text-slate-900 font-black',
                        accent: 'bg-white/80 border-slate-300',
                        btnBg: 'bg-white text-slate-900'
                      },
                    ].map((t) => (
                      <div 
                        key={t.id}
                        onClick={() => {
                          if (t.isPro && !unlockedProThemes) {
                            setShowPayModal(true)
                          } else {
                            setSelectedTheme(t.id as any)
                          }
                        }}
                        className={`rounded-2xl border-2 p-1.5 cursor-pointer transition flex flex-col justify-between h-[210px] relative overflow-hidden group ${
                          selectedTheme === t.id
                            ? 'border-[#7c3aed] ring-2 ring-purple-100 bg-purple-50/20 shadow-md scale-[1.02]'
                            : t.isPro
                            ? 'border-amber-400/60 bg-amber-50/10 hover:border-amber-500'
                            : 'border-slate-200 hover:border-purple-300 bg-white'
                        }`}
                      >
                        {/* PRO ₹99 Badge */}
                        {t.isPro && (
                          <div className="absolute top-1.5 right-1.5 z-20 bg-amber-500 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                            <span>PRO</span>
                            <span>• {t.price}</span>
                          </div>
                        )}

                        {/* Mini Theme Card Mock Visual */}
                        <div className={`w-full flex-1 rounded-xl p-2 flex flex-col items-center text-center relative overflow-hidden select-none ${t.bg}`}>
                          
                          {/* Top Logo */}
                          <div className={`w-4 h-4 rounded-md font-black text-[9px] flex items-center justify-center absolute top-1.5 left-1.5 ${t.logoColor}`}>
                            K
                          </div>

                          {/* Avatar */}
                          <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden bg-purple-200 mt-2 mb-1 shrink-0 relative">
                            <img 
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" 
                              alt="Ashwin"
                              className="w-full h-full object-cover" 
                            />
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border border-white" />
                          </div>

                          {/* Name & Title */}
                          <h5 className="text-[9px] font-extrabold leading-none truncate max-w-full px-0.5">{cardFullName || 'Ashwin Baby'}</h5>
                          <p className="text-[7px] font-semibold opacity-70 mt-0.5 leading-none">{cardJobTitle || 'Founder & CEO'}</p>
                          <p className="text-[6px] opacity-50 truncate max-w-full scale-90">{cardCompany || 'Kodeversity'}</p>

                          {/* Action Icon Row */}
                          <div className="flex justify-center gap-1 my-1.5">
                            {[1, 2, 3, 4].map(idx => (
                              <div key={idx} className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] ${t.btnBg}`}>
                                •
                              </div>
                            ))}
                          </div>

                          {/* Bio */}
                          <p className="text-[5.5px] opacity-65 leading-tight line-clamp-2 scale-95 transform-gpu">
                            Building digital products & AI solutions...
                          </p>

                        </div>

                        {/* Bottom Label & Radio Selector */}
                        <div className="flex items-center justify-between px-1.5 pt-1.5 pb-0.5">
                          <span className={`text-[10px] font-bold ${selectedTheme === t.id ? 'text-[#7c3aed]' : t.isPro ? 'text-amber-700' : 'text-slate-700'}`}>
                            {t.name}
                          </span>
                          
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            selectedTheme === t.id ? 'border-[#7c3aed] bg-[#7c3aed]' : 'border-slate-300 bg-white'
                          }`}>
                            {selectedTheme === t.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                  {/* UNLOCK ALL PAID THEMES (₹99) BANNER */}
                  <div 
                    onClick={() => setShowPayModal(true)}
                    className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border-2 border-dashed border-amber-400/60 hover:border-amber-500 rounded-2xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer transition active:scale-[0.99] my-1"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-amber-500/30 shrink-0">
                        👑
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800 truncate">Unlock VIP Paid Themes</h4>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black tracking-wide shrink-0">
                            ₹99
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium truncate">Get lifetime access to Metallic Gold, Cyber Neon & Platinum themes.</p>
                      </div>
                    </div>
                    <button className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition border-none shrink-0 ml-2">
                      Unlock ₹99
                    </button>
                  </div>

                  {/* INFO NOTE BANNER */}
                  <div className="bg-purple-50/80 rounded-xl p-3 flex items-center gap-2.5">
                    <Info size={14} className="text-[#7c3aed] shrink-0" />
                    <p className="text-[10px] text-slate-500 font-medium leading-snug">
                      You can change the theme anytime. This will update the look of your digital card.
                    </p>
                  </div>

                  {/* PRIMARY & SECONDARY ACTION BUTTONS */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button 
                      disabled={isSavingCard}
                      onClick={async () => {
                        await handleSaveCardDetails()
                        setCreateModal(false)
                        setEditCardStep(1)
                      }}
                      className="w-full py-3.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-xs active:scale-[0.98] cursor-pointer transition"
                    >
                      {isSavingCard ? (
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Save & Apply Theme</span>
                        </>
                      )}
                    </button>

                    <button 
                      disabled={isSavingCard}
                      onClick={async () => {
                        await handleSaveCardDetails()
                        setCreateModal(false)
                      }}
                      className="w-full py-3 bg-white border border-purple-200 text-[#7c3aed] hover:bg-purple-50 font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition cursor-pointer active:scale-[0.98]"
                    >
                      <FileText size={16} />
                      <span>Save as Draft</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          </div>
        )}

        {/* VERIFICATION MODAL OVERLAY (MANDATORY - CANNOT BE DISMISSED UNTIL VERIFIED) */}
        {showVerifyModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 select-none animate-fade-in">
            <div className="w-full max-w-[340px] bg-white rounded-[1.75rem] p-4 sm:p-5 shadow-2xl relative animate-scale-up flex flex-col items-center border border-purple-100 text-center">
              
              {/* Close Button on top right */}
              <button 
                onClick={() => setShowVerifyModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer transition"
              >
                <X size={16} />
              </button>

              {/* STEP 1: OTP VERIFICATION VIEW */}
              {verifyStep === 'otp' && (
                <>
                  {/* Top Illustration */}
                  <div className="flex items-center justify-center gap-4 relative mb-3 mt-1">
                    <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                      <div className="w-18 h-18 rounded-full bg-violet-500/10 blur-md" />
                    </div>

                    {/* Email Envelope Circle */}
                    {user.number !== 'Google OAuth' && (
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center relative border shadow-inner transition ${emailVerified ? 'bg-green-50 border-green-200' : 'bg-violet-50 border-violet-100'}`}>
                        <div className={`p-2 text-white rounded-xl shadow-md ${emailVerified ? 'bg-green-500' : 'bg-violet-500'}`}>
                          <Mail size={18} />
                        </div>
                        {emailVerified && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white">
                            <Check size={10} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Phone Mobile Circle */}
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center relative border shadow-inner transition ${phoneVerified ? 'bg-green-50 border-green-200' : 'bg-violet-50 border-violet-100'}`}>
                      <div className={`p-2 text-white rounded-xl shadow-md ${phoneVerified ? 'bg-green-500' : 'bg-violet-500'}`}>
                        <Smartphone size={18} />
                      </div>
                      {phoneVerified && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-extrabold text-slate-800">
                      {otpRequested ? 'Verify your account' : (user.number === 'Google OAuth' ? 'Verify your phone number' : 'Verify your email & phone number')}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug max-w-[260px] mx-auto">
                      {otpRequested 
                        ? "We've sent 6-digit OTPs to your email and phone number. Please verify to continue."
                        : (user.number === 'Google OAuth' 
                            ? 'To keep your account secure and access your card dashboard, please verify your phone number.' 
                            : 'To keep your account secure and access your card dashboard, please complete both email and phone verifications.')
                      }
                    </p>
                  </div>

                  {/* OTP Requested View (Matches Uploaded Mockup Screenshot Exactly) */}
                  {otpRequested ? (
                    <div className="w-full flex flex-col gap-2.5">
                      {/* Verify Email OTP Box */}
                      {user.number !== 'Google OAuth' && (
                        <div className="w-full border border-violet-100 bg-white p-2.5 rounded-xl shadow-sm text-left">
                          <div className="flex items-start gap-2.5 mb-1.5">
                            <div className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                              <Mail size={14} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[11px] font-bold text-slate-800">Verify Email</h4>
                              <p className="text-[9px] text-slate-400 font-semibold truncate">
                                OTP sent to <span className="text-slate-700 font-bold">{customEmail || user.email}</span>
                              </p>
                            </div>
                          </div>

                          {/* 6 Digit Input Boxes */}
                          <div className="flex justify-between gap-1 my-2">
                            {emailOtp.map((digit, index) => (
                              <input
                                key={index}
                                id={`email-otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={async (e) => {
                                  const val = e.target.value
                                  const newOtp = [...emailOtp]
                                  newOtp[index] = val
                                  setEmailOtp(newOtp)
                                  if (val && index < 5) {
                                    document.getElementById(`email-otp-${index + 1}`)?.focus()
                                  }
                                  if (newOtp.join('').length === 6) {
                                    try {
                                      await verifyOtpServer({ data: { email: user.email, otp: newOtp.join(''), type: 'email' } })
                                      setEmailVerified(true)
                                    } catch (err: any) {
                                      alert(err.message || 'Invalid OTP. Please enter 123456.')
                                    }
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Backspace' && !digit && index > 0) {
                                    document.getElementById(`email-otp-${index - 1}`)?.focus()
                                  }
                                }}
                                className="w-7.5 h-9 border border-violet-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-lg text-center text-xs font-bold text-slate-800 outline-none transition bg-white"
                              />
                            ))}
                          </div>

                          {/* Timer & Resend */}
                          <div className="flex justify-between items-center text-[9px]">
                            <span className="text-slate-400 font-medium">OTP expires in <strong className="text-[#7c3aed] font-bold">10:00</strong></span>
                            <button 
                              onClick={() => handleResendOtp('email')}
                              className="flex items-center gap-1 font-bold text-[#7c3aed] hover:underline bg-transparent border-none cursor-pointer"
                            >
                              <RefreshCw size={9} /> Resend OTP
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Verify Phone Number OTP Box */}
                      <div className="w-full border border-violet-100 bg-white p-2.5 rounded-xl shadow-sm text-left">
                        <div className="flex items-start gap-2.5 mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-violet-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                            <Smartphone size={14} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[11px] font-bold text-slate-800">Verify Phone Number</h4>
                            <p className="text-[9px] text-slate-400 font-semibold truncate">
                              SMS service unavailable — OTP sent to <span className="text-slate-700 font-bold">{customEmail || user.email}</span>
                            </p>
                          </div>
                        </div>

                        {/* 6 Digit Input Boxes */}
                        <div className="flex justify-between gap-1 my-2">
                          {phoneOtp.map((digit, index) => (
                            <input
                              key={index}
                              id={`phone-otp-${index}`}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={async (e) => {
                                const val = e.target.value
                                const newOtp = [...phoneOtp]
                                newOtp[index] = val
                                setPhoneOtp(newOtp)
                                if (val && index < 5) {
                                  document.getElementById(`phone-otp-${index + 1}`)?.focus()
                                }
                                if (newOtp.join('').length === 6) {
                                  try {
                                    await verifyOtpServer({ data: { email: user.email, otp: newOtp.join(''), type: 'mobile' } })
                                    setPhoneVerified(true)
                                  } catch (err: any) {
                                    alert(err.message || 'Invalid verification code. Please check your email.')
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !digit && index > 0) {
                                  document.getElementById(`phone-otp-${index - 1}`)?.focus()
                                }
                              }}
                              className="w-7.5 h-9 border border-violet-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-lg text-center text-xs font-bold text-slate-800 outline-none transition bg-white"
                            />
                          ))}
                        </div>

                        {/* Timer & Resend */}
                        <div className="flex justify-between items-center text-[9px]">
                          <span className="text-slate-400 font-medium">OTP expires in <strong className="text-[#7c3aed] font-bold">10:00</strong></span>
                          <button 
                            onClick={() => handleResendOtp('mobile')}
                            className="flex items-center gap-1 font-bold text-[#7c3aed] hover:underline bg-transparent border-none cursor-pointer"
                          >
                            <RefreshCw size={9} /> Resend OTP
                          </button>
                        </div>
                      </div>

                      {/* WhatsApp Support Banner */}
                      <div className="w-full border border-violet-100 bg-slate-50/70 p-2.5 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <MessageCircle size={14} />
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-[10px] font-extrabold text-slate-800">Didn't receive OTP?</p>
                            <p className="text-[8px] text-slate-400 truncate">Chat on WhatsApp</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => window.open('https://wa.me/', '_blank')}
                          className="px-2.5 py-1 rounded-full border border-[#7c3aed] text-[#7c3aed] hover:bg-violet-50 font-bold text-[9px] transition bg-white shrink-0 cursor-pointer shadow-sm"
                        >
                          Contact Support
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Initial List Fields before pressing Request OTP */
                    <div className="w-full flex flex-col gap-2.5">
                      {user.number !== 'Google OAuth' ? (
                        <>
                          {/* Verify Email Box */}
                          <div className={`w-full border p-2.5 rounded-xl flex items-center justify-between transition ${emailVerified ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${emailVerified ? 'bg-green-100 text-green-600' : 'bg-violet-50 text-violet-600'}`}>
                                <Mail size={14} />
                              </div>
                              {editingTarget === 'email' ? (
                                <div className="flex items-center gap-1 flex-1 pr-1">
                                  <input 
                                    type="email"
                                    value={customEmail || user.email}
                                    onChange={e => setCustomEmail(e.target.value)}
                                    className="w-full bg-white border border-violet-200 rounded-lg px-2 py-0.5 text-[11px] text-slate-800 outline-none"
                                  />
                                  <button 
                                    onClick={() => setEditingTarget(null)}
                                    className="bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg border-none cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <div className="text-left truncate pr-1">
                                  <p className="text-[11px] font-bold text-slate-700">Email Address</p>
                                  <p className="text-[9px] text-slate-400 font-semibold truncate">{customEmail || user.email}</p>
                                </div>
                              )}
                            </div>
                            {emailVerified ? (
                              <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Check size={10} /> Verified
                              </span>
                            ) : (
                              <button
                                onClick={() => setEditingTarget(editingTarget === 'email' ? null : 'email')}
                                className="flex items-center gap-1 text-[9px] font-bold text-violet-600 hover:text-violet-700 bg-violet-100 hover:bg-violet-200 px-2 py-0.5 rounded-full transition border-none cursor-pointer shrink-0"
                              >
                                <Edit2 size={10} /> Edit
                              </button>
                            )}
                          </div>

                          {/* Verify Phone Box */}
                          <div className={`w-full border p-2.5 rounded-xl flex items-center justify-between transition ${phoneVerified ? 'border-green-200 bg-green-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${phoneVerified ? 'bg-green-100 text-green-600' : 'bg-violet-50 text-violet-600'}`}>
                                <Smartphone size={14} />
                              </div>
                              {editingTarget === 'phone' ? (
                                <div className="flex items-center gap-1 flex-1 pr-1">
                                  <input 
                                    type="tel"
                                    value={customPhone || user.number}
                                    onChange={e => setCustomPhone(e.target.value)}
                                    className="w-full bg-white border border-violet-200 rounded-lg px-2 py-0.5 text-[11px] text-slate-800 outline-none"
                                  />
                                  <button 
                                    onClick={() => setEditingTarget(null)}
                                    className="bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg border-none cursor-pointer"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <div className="text-left truncate pr-1">
                                  <p className="text-[11px] font-bold text-slate-700">Phone Number</p>
                                  <p className="text-[9px] text-slate-400 font-semibold truncate">{customPhone || user.number}</p>
                                </div>
                              )}
                            </div>
                            {phoneVerified ? (
                              <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Check size={10} /> Verified
                              </span>
                            ) : (
                              <button
                                onClick={() => setEditingTarget(editingTarget === 'phone' ? null : 'phone')}
                                className="flex items-center gap-1 text-[9px] font-bold text-violet-600 hover:text-violet-700 bg-violet-100 hover:bg-violet-200 px-2 py-0.5 rounded-full transition border-none cursor-pointer shrink-0"
                              >
                                <Edit2 size={10} /> Edit
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        /* Google User: Enter Phone Number Input */
                        <div className="w-full flex flex-col gap-2.5">
                          {!phoneVerified ? (
                            <div className="relative flex items-center">
                              <Smartphone className="absolute left-3 text-violet-500 w-3.5 h-3.5 pointer-events-none" />
                              <input 
                                type="tel"
                                placeholder="Enter your phone number"
                                value={googleMobile}
                                onChange={e => setGoogleMobile(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-violet-400 rounded-xl py-2.5 pl-9 pr-3 text-[11px] font-semibold text-slate-700 placeholder-slate-400 outline-none transition"
                              />
                            </div>
                          ) : (
                            <div className="w-full border border-green-200 bg-green-50/50 p-2.5 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                  <Smartphone size={14} />
                                </div>
                                <div>
                                  <p className="text-[11px] font-bold text-slate-700">Phone Number</p>
                                  <p className="text-[9px] text-slate-400 font-semibold">{googleMobile}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Check size={10} /> Verified
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button: Request OTP or Proceed to Verified Success Screen */}
                  <button 
                    onClick={async () => {
                      if (!otpRequested) {
                        if (user.number === 'Google OAuth' && !googleMobile) {
                          alert("Please enter your phone number first.")
                          return
                        }
                        setOtpRequested(true)
                      } else {
                        // Mark verified in MongoDB and advance to Verified Success screen
                        try {
                          await updateUserProfile({
                            data: {
                              email: user.email,
                              number: googleMobile || customPhone || user.number,
                              isEmailVerified: true,
                              isNumberVerified: true,
                            }
                          })
                        } catch (e) {}

                        setEmailVerified(true)
                        setPhoneVerified(true)
                        const updatedUser = { ...user, isEmailVerified: true, isNumberVerified: true }
                        setUser(updatedUser)
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                        setVerifyStep('verified_success')
                      }
                    }}
                    className={`w-full font-bold py-2.5 rounded-xl transition shadow-md mt-3 cursor-pointer text-xs ${
                      otpRequested && ((user.number !== 'Google OAuth' && emailVerified && phoneVerified) || (user.number === 'Google OAuth' && phoneVerified))
                        ? 'bg-green-600 hover:bg-green-700 text-white active:scale-[0.98]'
                        : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white active:scale-[0.98]'
                    }`}
                  >
                    {!otpRequested 
                      ? 'Request OTP' 
                      : ((user.number !== 'Google OAuth' && emailVerified && phoneVerified) || (user.number === 'Google OAuth' && phoneVerified)
                          ? 'Access Dashboard ✓' 
                          : 'Verify & Continue ✓')
                    }
                  </button>
                </>
              )}

              {/* STEP 2: EMAIL & PHONE VERIFIED SUCCESS VIEW (Screen 2 in Screenshot) */}
              {verifyStep === 'verified_success' && (
                <div className="w-full flex flex-col items-center animate-fade-in py-1">
                  {/* Top Green Check Circle */}
                  <div className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/25 mb-3">
                    <Check size={28} strokeWidth={3.5} />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base font-extrabold text-slate-800">Email & Phone Verified!</h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[250px] leading-snug">
                    Your email and phone number have been successfully verified.
                  </p>

                  {/* Middle Illustration Card */}
                  <div className="w-full bg-violet-50/70 border border-violet-100 rounded-2xl p-4 flex flex-col items-center justify-center my-4 relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#7c3aed] to-[#5b21b6] text-white flex items-center justify-center relative shadow-md">
                      <User size={26} />
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-white">
                        <Check size={10} strokeWidth={3.5} />
                      </div>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 mt-2.5">Let's complete your profile</h4>
                    <p className="text-[10px] text-slate-400 font-medium text-center mt-1">
                      Add your company name (if any) to personalize your experience.
                    </p>
                  </div>

                  {/* Primary Continue Button */}
                  <button 
                    onClick={() => setVerifyStep('company_input')}
                    className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer active:scale-95"
                  >
                    Continue
                  </button>

                  {/* Secondary Skip for now */}
                  <button 
                    onClick={async () => {
                      try {
                        const skipCompany = user.companyName || 'N/A'
                        const res = await updateUserProfile({
                          data: {
                            email: user.email,
                            companyName: skipCompany,
                          }
                        })
                        const updatedUser = res?.user || { ...user, companyName: skipCompany }
                        setUser(updatedUser)
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                      } catch (e) {}
                      setShowVerifyModal(false)
                    }}
                    className="mt-2.5 text-xs font-bold text-[#7c3aed] hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Skip for now
                  </button>
                </div>
              )}

              {/* STEP 3: ADD COMPANY NAME VIEW (Screen 3 in Screenshot) */}
              {verifyStep === 'company_input' && (
                <div className="w-full flex flex-col items-center animate-fade-in py-1">
                  {/* Top Purple Building Circle */}
                  <div className="w-14 h-14 rounded-full bg-violet-100 text-[#7c3aed] flex items-center justify-center shadow-sm mb-3">
                    <Building size={26} />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-sm font-extrabold text-slate-800">
                    Add your company name <br />
                    <span className="text-slate-400 font-medium text-xs">(If you have one)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[250px] leading-snug">
                    This helps personalize your card and experience.
                  </p>

                  {/* Input Field */}
                  <div className="w-full text-left my-3">
                    <label className="text-[10px] font-bold text-slate-600 mb-1.5 block">
                      Company Name (Optional)
                    </label>
                    <div className="relative flex items-center">
                      <Building className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                      <input 
                        type="text"
                        placeholder="Enter company name"
                        value={companyInput}
                        onChange={e => setCompanyInput(e.target.value)}
                        className="w-full bg-white border border-violet-200 focus:border-[#7c3aed] focus:ring-2 focus:ring-purple-100 rounded-xl py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Tip Card */}
                  <div className="w-full bg-violet-50/70 border border-violet-100 p-2.5 rounded-xl flex items-center gap-2.5 mb-3 text-left">
                    <div className="p-1.5 rounded-lg bg-violet-100 text-[#7c3aed] shrink-0">
                      <Lightbulb size={14} />
                    </div>
                    <p className="text-[10px] text-slate-600 font-medium leading-tight">
                      You can add or change this later from Settings.
                    </p>
                  </div>

                  {/* Primary Save & Continue Button */}
                  <button 
                    onClick={async () => {
                      const finalCompany = companyInput.trim() || user.companyName || 'N/A'
                      try {
                        const res = await updateUserProfile({
                          data: {
                            email: user.email,
                            companyName: finalCompany,
                          }
                        })
                        const updatedUser = res?.user || { ...user, companyName: finalCompany }
                        setUser(updatedUser)
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                      } catch (e) {}
                      setShowVerifyModal(false)
                    }}
                    className="w-full py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold rounded-xl transition shadow-md text-xs cursor-pointer active:scale-95"
                  >
                    Save & Continue
                  </button>

                  {/* Secondary Skip for now */}
                  <button 
                    onClick={async () => {
                      try {
                        const skipCompany = user.companyName || 'N/A'
                        const res = await updateUserProfile({
                          data: {
                            email: user.email,
                            companyName: skipCompany,
                          }
                        })
                        const updatedUser = res?.user || { ...user, companyName: skipCompany }
                        setUser(updatedUser)
                        localStorage.setItem('user', JSON.stringify(updatedUser))
                      } catch (e) {}
                      setShowVerifyModal(false)
                    }}
                    className="mt-2.5 text-xs font-bold text-[#7c3aed] hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Skip for now
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* EDIT PROFILE DETAILS MODAL */}
        {editProfileModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-fade-in">
            <div className="w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-2xl relative animate-scale-up border border-purple-100">
              <button 
                onClick={() => setEditProfileModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer transition"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-violet-100 text-[#7c3aed] flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">Edit Profile Details</h3>
                  <p className="text-xs text-slate-400">Update your personal account information.</p>
                </div>
              </div>
              
              <form 
                onSubmit={async e => {
                  e.preventDefault()
                  const hasProfileChanged = (
                    editName.trim() !== (user.name || '') ||
                    editEmail.trim() !== (user.email || '') ||
                    editPhone.trim() !== (user.number || '')
                  )

                  if (hasProfileChanged) {
                    // Require verification for changing profile User table data
                    setEditProfileModal(false)
                    setCustomEmail(editEmail.trim())
                    setCustomPhone(editPhone.trim())
                    setEditingTarget('email')
                    setVerifyStep('otp')
                    setOtpRequested(false)
                    setShowVerifyModal(true)
                    try {
                      await verifyOtpServer({
                        data: {
                          email: editEmail.trim(),
                          phone: editPhone.trim(),
                          action: 'send_otp'
                        }
                      })
                      setOtpRequested(true)
                    } catch (err: any) {
                      alert(err.message || 'Failed to send verification OTP.')
                    }
                    return
                  }

                  // If only company name changed, update without requiring re-verification
                  try {
                    const res = await updateUserProfile({
                      data: {
                        email: user.email,
                        name: editName.trim(),
                        number: editPhone.trim(),
                        companyName: editCompany.trim(),
                      }
                    })
                    const updatedUser = res?.user || {
                      ...user,
                      name: editName.trim(),
                      email: editEmail.trim(),
                      number: editPhone.trim(),
                      companyName: editCompany.trim(),
                    }
                    setUser(updatedUser)
                    localStorage.setItem('user', JSON.stringify(updatedUser))
                    setEditProfileModal(false)
                    alert('Profile details updated successfully!')
                  } catch (err: any) {
                    alert(err.message || 'Failed to update profile.')
                  }
                }}
                className="flex flex-col gap-4"
              >
                {/* Full Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input 
                      type="text"
                      required
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input 
                      type="email"
                      required
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Smartphone className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input 
                      type="tel"
                      required
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block uppercase tracking-wider">
                    Company Name
                  </label>
                  <div className="relative flex items-center">
                    <Building className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input 
                      type="text"
                      placeholder="e.g. TroxCard Inc."
                      value={editCompany}
                      onChange={e => setEditCompany(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-violet-500 rounded-xl py-2.5 pl-10 pr-3 text-xs font-semibold text-slate-800 outline-none transition"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                  <button 
                    type="button"
                    onClick={() => setEditProfileModal(false)}
                    className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl border-none cursor-pointer transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:opacity-95 rounded-xl border-none cursor-pointer shadow-md active:scale-95 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SHARE CARD MODAL OVERLAY */}
        {showShareModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
            <div className="w-full max-w-md bg-white rounded-[2rem] p-5 sm:p-6 shadow-2xl relative animate-scale-up border border-purple-100 my-auto text-left max-h-[90vh] overflow-y-auto scrollbar-none">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7c3aed] flex items-center justify-center font-bold">
                    <Share2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 leading-tight">Share Your Card</h3>
                    <p className="text-xs text-slate-400 font-medium">Select how you want to share</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center border-none cursor-pointer transition active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Copy Link Section */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Card Link</label>
                <div 
                  onClick={async () => {
                    const ok = await copyToClipboard(cardUrl)
                    if (ok) {
                      setLinkCopied(true)
                      setTimeout(() => setLinkCopied(false), 2000)
                    }
                  }}
                  className="bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl p-1.5 flex items-center gap-2 cursor-pointer transition select-all"
                >
                  <div className="pl-3 pr-1 text-slate-400">
                    <Link size={16} />
                  </div>
                  <input 
                    type="text" 
                    readOnly 
                    value={cardUrl} 
                    className="flex-1 bg-transparent text-xs font-semibold text-slate-800 outline-none truncate cursor-pointer"
                  />
                  <button 
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation()
                      const ok = await copyToClipboard(cardUrl)
                      if (ok) {
                        setLinkCopied(true)
                        setTimeout(() => setLinkCopied(false), 2000)
                      } else {
                        alert(`Card Link: ${cardUrl}`)
                      }
                    }}
                    className={`min-w-[88px] h-9 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-none shrink-0 ${
                      linkCopied 
                        ? 'bg-green-600 text-white shadow-sm' 
                        : 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-sm'
                    }`}
                  >
                    {linkCopied ? (
                      <>
                        <Check size={14} strokeWidth={3} className="shrink-0" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <span>Copy</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Share Options Grid */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-700 mb-2.5 block">Share Via</label>
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out my digital business card: ${cardUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 p-3 rounded-2xl flex flex-col items-center gap-2 text-center transition cursor-pointer no-underline group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                      <MessageCircle size={20} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">WhatsApp</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(cardUrl)}&text=${encodeURIComponent(`Check out my digital business card!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/30 p-3 rounded-2xl flex flex-col items-center gap-2 text-center transition cursor-pointer no-underline group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                      <Send size={18} className="translate-x-0.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Telegram</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cardUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 p-3 rounded-2xl flex flex-col items-center gap-2 text-center transition cursor-pointer no-underline group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                      <LinkedinIcon size={18} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">LinkedIn</span>
                  </a>

                  {/* Twitter / X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Connect with me on TroxCard: ${cardUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-300 p-3 rounded-2xl flex flex-col items-center gap-2 text-center transition cursor-pointer no-underline group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition font-black text-xs">
                      X
                    </div>
                    <span className="text-xs font-bold text-slate-800">Twitter / X</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`${user.name} - Digital Business Card`)}&body=${encodeURIComponent(`Here is my digital business card: ${cardUrl}`)}`}
                    className="bg-purple-50 hover:bg-purple-100 border border-purple-200 p-3 rounded-2xl flex flex-col items-center gap-2 text-center transition cursor-pointer no-underline group active:scale-95"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#7c3aed] text-white flex items-center justify-center shadow-md group-hover:scale-105 transition">
                      <Mail size={18} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Email</span>
                  </a>

                  {/* System Share (Native) */}
                  <button
                    onClick={async () => {
                      if (navigator.share) {
                        try {
                          await navigator.share({
                            title: `${user.name} - Digital Business Card`,
                            text: `Connect with ${user.name} on TroxCard!`,
                            url: cardUrl,
                          })
                        } catch (e) {}
                      } else {
                        try {
                          await navigator.clipboard.writeText(cardUrl)
                          setLinkCopied(true)
                          setTimeout(() => setLinkCopied(false), 2000)
                        } catch (e) {}
                      }
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-3 rounded-2xl flex flex-col items-center gap-2 text-center transition cursor-pointer active:scale-95 border-none"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md hover:scale-105 transition">
                      <Share2 size={18} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">More...</span>
                  </button>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-xl p-1 border border-slate-200 flex items-center justify-center shrink-0">
                    <QRCodeImage value={cardUrl} darkColor="#1e293b" lightColor="#ffffff" className="w-full h-full" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Card QR Code</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Scan or download QR code</p>
                  </div>
                </div>
                <button 
                  onClick={handleDownloadQr}
                  className="px-3 py-1.5 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-[#7c3aed] font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                >
                  <Download size={14} />
                  <span>Save QR</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* PAID THEMES ₹99 UNLOCK MODAL OVERLAY */}
        {showPayModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in select-none">
            <div className="w-full max-w-sm bg-white rounded-[2rem] p-6 shadow-2xl relative animate-scale-up border border-purple-100 text-center">
              <button 
                onClick={() => setShowPayModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 border-none cursor-pointer transition active:scale-95"
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30 mx-auto mb-3 mt-1">
                👑
              </div>

              <h3 className="text-lg font-black text-slate-800">Unlock TroxCard PRO Themes</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Exclusive VIP Metallic, Cyberpunk & Platinum styles</p>

              <div className="my-5 p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-left flex flex-col gap-2">
                <div className="flex justify-between items-center pb-2 border-b border-amber-200/60">
                  <span className="text-xs font-extrabold text-amber-900">PRO Themes Lifetime Pass</span>
                  <span className="text-lg font-black text-amber-600">₹99</span>
                </div>
                <ul className="text-[11px] font-semibold text-amber-900/90 flex flex-col gap-1.5 pl-1 mt-1">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-600 shrink-0" strokeWidth={3} />
                    <span>Obsidian Gold, Cyber Neon & Platinum Glass themes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-600 shrink-0" strokeWidth={3} />
                    <span>Exclusive 3D Metallic foil badges & NFC support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-amber-600 shrink-0" strokeWidth={3} />
                    <span>One-time lifetime payment (No recurring fee)</span>
                  </li>
                </ul>
              </div>

              <button 
                onClick={() => {
                  setUnlockedProThemes(true)
                  setSelectedTheme('pro_gold')
                  setShowPayModal(false)
                  alert('🎉 Payment of ₹99 successful! PRO Themes unlocked successfully.')
                }}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-500/30 text-xs cursor-pointer transition active:scale-95 border-none flex items-center justify-center gap-2"
              >
                <span>Pay ₹99 & Unlock Instantly</span>
              </button>

              <button 
                onClick={() => setShowPayModal(false)}
                className="mt-3 text-xs font-bold text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          </div>
        )}
      </main>
    )
  }

  // 3. LOGIN PAGE STATE
  if (view === 'login') {
    return (
      <main className="fixed inset-0 w-screen h-screen overflow-y-auto flex flex-col items-center bg-gradient-to-b from-[#7c3aed] via-[#5b21b6] to-[#2e1065] text-white px-6 pt-6 pb-12 select-none font-sans z-50">
        {/* Decorative top ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-violet-400/20 blur-[120px] pointer-events-none" />

        {/* Main card box containing login form */}
        <div className="w-full max-w-sm flex flex-col items-center z-10 mt-4 mb-8">
          
          {/* Logo */}
          <img 
            src="/logo.png" 
            alt="TroxCard Logo" 
            className="w-56 sm:w-64 h-auto select-none pointer-events-none mix-blend-screen mb-8"
          />

          {/* Headings */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              Welcome back!
            </h2>
            <p className="text-xs text-white/70">
              Log in to continue sharing smarter.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLocalLogin} className="w-full flex flex-col gap-4">
            
            {/* Email or Phone field */}
            <div className="relative flex items-center">
              <User className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
              <input 
                type="text"
                placeholder="Email or Mobile Number"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/50 outline-none transition"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-white/50 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-4 text-white/50 hover:text-white/80 border-none bg-transparent cursor-pointer transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Forgot Password Link */}
              <a 
                href="#" 
                onClick={e => e.preventDefault()}
                className="text-xs text-white/80 hover:text-white self-end font-medium transition no-underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Log In Button */}
            <button 
              type="submit"
              className="w-full bg-white text-violet-900 hover:bg-white/95 font-bold py-3.5 rounded-xl transition text-sm shadow-md mt-2 cursor-pointer active:scale-[0.98]"
            >
              Log In
            </button>

          </form>

          {/* OR Divider */}
          <div className="w-full flex items-center gap-4 text-xs text-white/40 my-6">
            <div className="flex-1 h-px bg-white/15" />
            <span>OR</span>
            <div className="flex-1 h-px bg-white/15" />
          </div>

          {/* Google OAuth Button */}
          <button 
            onClick={handleGoogleLogin}
            className="w-full border border-white/20 hover:bg-white/5 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm font-semibold text-white shadow-sm cursor-pointer active:scale-[0.98]"
          >
            {/* Google Icon SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer sign up text */}
          <p className="text-xs text-white/70 text-center mt-8">
            Don't have an account? 
            <button 
              onClick={() => setView('signup')}
              className="text-violet-300 hover:text-violet-200 font-bold ml-1 transition border-none bg-transparent cursor-pointer p-0 underline"
            >
              Sign Up
            </button>
          </p>

        </div>
      </main>
    )
  }

  // 4. SIGN-UP PAGE STATE
  return (
    <main className="fixed inset-0 w-screen h-screen overflow-y-auto flex flex-col items-center bg-gradient-to-b from-[#7c3aed] via-[#5b21b6] to-[#2e1065] text-white px-6 pt-6 pb-12 select-none font-sans z-50">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-violet-400/20 blur-[120px] pointer-events-none" />

      {/* Main card box containing signup form */}
      <div className="w-full max-w-sm flex flex-col items-center z-10 mt-4 mb-8">
        
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="TroxCard Logo" 
          className="w-56 sm:w-64 h-auto select-none pointer-events-none mix-blend-screen mb-8"
        />

        {/* Headings */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
            Create your account
          </h2>
          <p className="text-xs text-white/70">
            Join Troxcard and start sharing smarter.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLocalSignup} className="w-full flex flex-col gap-4">
          
          {/* Full Name field */}
          <div className="relative flex items-center">
            <User className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
            <input 
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/50 outline-none transition"
            />
          </div>

          {/* Mobile Number field */}
          <div className="relative flex items-center">
            <Smartphone className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
            <input 
              type="tel"
              placeholder="Mobile Number"
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/50 outline-none transition"
            />
          </div>

          {/* Email Address field */}
          <div className="relative flex items-center">
            <Mail className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
            <input 
              type="email"
              placeholder="Email Address"
              value={signupEmail}
              onChange={e => setSignupEmail(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/50 outline-none transition"
            />
          </div>

          {/* Create Password field */}
          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
              value={signupPassword}
              onChange={e => setSignupPassword(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-white/50 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-4 text-white/50 hover:text-white/80 border-none bg-transparent cursor-pointer transition"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Confirm Password field */}
          <div className="relative flex items-center">
            <Lock className="absolute left-4 text-white/50 w-5 h-5 pointer-events-none" />
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-white/40 rounded-xl py-3.5 pl-12 pr-12 text-sm text-white placeholder-white/50 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-4 text-white/50 hover:text-white/80 border-none bg-transparent cursor-pointer transition"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Agree Terms Checkbox */}
          <label className="flex items-start gap-2.5 mt-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={agreeTerms}
              onChange={e => setAgreeTerms(e.target.checked)}
              className="mt-1 rounded border-white/20 bg-white/10 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <span className="text-xs text-white/80">
              I agree to the <a href="#" onClick={e => e.preventDefault()} className="text-violet-300 hover:text-violet-200 underline font-semibold">Terms of Service</a> and <a href="#" onClick={e => e.preventDefault()} className="text-violet-300 hover:text-violet-200 underline font-semibold">Privacy Policy</a>
            </span>
          </label>

          {/* Create Account Button */}
          <button 
            type="submit"
            className="w-full bg-white text-violet-900 hover:bg-white/95 font-bold py-3.5 rounded-xl transition text-sm shadow-md mt-4 cursor-pointer active:scale-[0.98]"
          >
            Create Account
          </button>

        </form>

        {/* OR Divider */}
        <div className="w-full flex items-center gap-4 text-xs text-white/40 my-6">
          <div className="flex-1 h-px bg-white/15" />
          <span>OR</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        {/* Google OAuth Button (Sign Up) */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full border border-white/20 hover:bg-white/5 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm font-semibold text-white shadow-sm cursor-pointer active:scale-[0.98]"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Sign up with Google</span>
        </button>

        {/* Footer log in text */}
        <p className="text-xs text-white/70 text-center mt-8">
          Already have an account? 
          <button 
            onClick={() => setView('login')}
            className="text-violet-300 hover:text-violet-200 font-bold ml-1 transition border-none bg-transparent cursor-pointer p-0 underline"
          >
            Log In
          </button>
        </p>

      </div>
    </main>
  )
}
