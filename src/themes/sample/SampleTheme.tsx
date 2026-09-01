import { useState } from 'react'
import { 
  Phone, Mail, Globe, MapPin, Download, ChevronRight, Calendar, FileText, 
  UserPlus, CheckCircle2, MessageCircle
} from 'lucide-react'

// Inline Social Icon Components
function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  )
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
      <rect width="4" height="12" x="2" y="9"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function YoutubeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
      <polygon points="10 15 15 12 10 9 10 15"/>
    </svg>
  )
}

interface SampleThemeProps {
  card: {
    fullName?: string
    jobTitle?: string
    company?: string
    bio?: string
    aboutBio?: string
    phone?: string
    email?: string
    website?: string
    location?: string
    instagram?: string
    whatsapp?: string
    facebook?: string
    linkedin?: string
    ctaText?: string
    ctaLink?: string
    brochureName?: string
    brochureUrl?: string
    photoUrl?: string
  }
}

export function SampleTheme({ card }: SampleThemeProps) {
  const [downloaded, setDownloaded] = useState(false)

  // Default Mock Values matching the uploaded screenshot if missing
  const name = card.fullName || 'Ashwin Baby'
  const title = card.jobTitle || 'Founder & CEO'
  const companyName = card.company || 'Kodeversity Technologies Pvt. Ltd.'
  const about = card.aboutBio || card.bio || 'Building digital products & AI solutions that drive real impact.'
  const phoneNum = card.phone || '+91 7356 567 890'
  const emailAddr = card.email || 'ashwin@kodeversity.com'
  const webUrl = card.website || 'https://kodeversity.com'
  const locationAddr = card.location || 'Kerala, India'
  const brochure = card.brochureName || 'Company_Brochure.pdf'
  const ctaTitle = card.ctaText || 'Book a Meeting'

  // Helper function to generate and download .vcf contact card
  const handleSaveContact = () => {
    const vcardData = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TITLE:${title}
ORG:${companyName}
TEL;TYPE=CELL:${phoneNum}
EMAIL:${emailAddr}
URL:${webUrl}
NOTE:${about}
END:VCARD`

    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${name.replace(/\s+/g, '_')}.vcf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#f3e8ff] via-[#faf5ff] to-white text-slate-800 font-sans relative overflow-hidden select-none pb-12">
      
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute top-12 right-6 grid grid-cols-6 gap-2 opacity-20 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
        ))}
      </div>

      <div className="max-w-md mx-auto px-5 pt-6 relative z-10">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo Badge ("K") */}
          <div className="w-11 h-11 rounded-2xl bg-[#7c3aed] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
            K
          </div>

          {/* Save Contact Button */}
          <button 
            onClick={handleSaveContact}
            className="bg-white/90 hover:bg-white text-[#7c3aed] font-extrabold text-xs px-4 py-2 rounded-full shadow-md border border-purple-100/80 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shrink-0"
          >
            <UserPlus size={15} />
            <span>{downloaded ? 'Contact Saved ✓' : 'Save Contact'}</span>
          </button>
        </div>

        {/* Profile Avatar & Info */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          
          {/* Circular Photo Box with Green Dot Status Badge */}
          <div className="relative mb-4 shrink-0">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-purple-200 flex items-center justify-center shrink-0">
              {card.photoUrl ? (
                <img 
                  src={card.photoUrl} 
                  alt={name} 
                  loading="eager"
                  decoding="async"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover shrink-0" 
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" 
                  alt={name} 
                  loading="eager"
                  decoding="async"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover shrink-0" 
                />
              )}
            </div>
            <div className="w-5 h-5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-1 right-1 shadow-sm shrink-0" />
          </div>

          {/* User Name & Blue Verified Badge */}
          <div className="flex items-center gap-1.5 justify-center">
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{name}</h1>
            <CheckCircle2 size={20} className="text-blue-500 fill-blue-500 text-white shrink-0" />
          </div>

          {/* Job Title */}
          <p className="text-sm font-bold text-[#7c3aed] mt-1">{title}</p>

          {/* Company Name */}
          <p className="text-xs font-semibold text-slate-500 mt-1">{companyName}</p>
        </div>

        {/* Quick Action Icon Buttons Row (Call, WhatsApp, Email, Website, Location) */}
        <div className="flex justify-center items-center gap-3.5 my-6">
          {[
            { label: 'Call', icon: <Phone size={20} className="text-[#7c3aed]" />, href: `tel:${phoneNum}` },
            { label: 'WhatsApp', icon: <MessageCircle size={20} className="text-[#7c3aed]" />, href: card.whatsapp || `https://wa.me/${phoneNum.replace(/[^0-9]/g, '')}` },
            { label: 'Email', icon: <Mail size={20} className="text-[#7c3aed]" />, href: `mailto:${emailAddr}` },
            { label: 'Website', icon: <Globe size={20} className="text-[#7c3aed]" />, href: webUrl },
            { label: 'Location', icon: <MapPin size={20} className="text-[#7c3aed]" />, href: `https://maps.google.com/?q=${encodeURIComponent(locationAddr)}` },
          ].map((act, i) => (
            <a
              key={i}
              href={act.href}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center no-underline cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-purple-50 flex items-center justify-center group-hover:scale-105 group-active:scale-95 transition">
                {act.icon}
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-2">{act.label}</span>
            </a>
          ))}
        </div>

        <div className="w-full h-[1px] bg-purple-100/60 my-6" />

        {/* About Me Section */}
        <div className="text-left mb-6">
          <h2 className="text-sm font-extrabold text-[#7c3aed] mb-1.5 block">About Me</h2>
          <p className="text-xs font-medium text-slate-600 leading-relaxed mb-4">
            {about}
          </p>

          {/* Social Media Link Buttons Row */}
          <div className="flex items-center gap-3">
            {[
              { icon: <InstagramIcon size={18} />, href: card.instagram || '#' },
              { icon: <FacebookIcon size={18} />, href: card.facebook || '#' },
              { icon: <LinkedinIcon size={18} />, href: card.linkedin || '#' },
              { icon: <YoutubeIcon size={18} />, href: '#' },
            ].map((soc, idx) => (
              <a
                key={idx}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white shadow-sm border border-purple-100 flex items-center justify-center text-purple-600 hover:bg-purple-50 transition no-underline"
              >
                {soc.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Multi-Row Content Card */}
        <div className="bg-white rounded-3xl border border-purple-100/80 shadow-lg divide-y divide-slate-100 my-6 overflow-hidden text-left">
          
          {/* Row 1: Website */}
          <a href={webUrl} target="_blank" rel="noreferrer" className="p-4 flex items-center justify-between hover:bg-slate-50 transition no-underline">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#7c3aed]">Website</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{webUrl}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 shrink-0" />
          </a>

          {/* Row 2: Brochure */}
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer" onClick={() => alert("Downloading brochure PDF...")}>
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#7c3aed]">Brochure</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{brochure}</p>
              </div>
            </div>
            <Download size={18} className="text-[#7c3aed] shrink-0" />
          </div>

          {/* Row 3: Book a Meeting */}
          <a href={card.ctaLink || 'https://calendly.com'} target="_blank" rel="noreferrer" className="p-4 flex items-center justify-between hover:bg-slate-50 transition no-underline">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7c3aed] flex items-center justify-center shrink-0">
                <Calendar size={20} />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#7c3aed]">{ctaTitle}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Schedule a meeting with me</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400 shrink-0" />
          </a>

        </div>

        {/* Footer Branding */}
        <div className="text-center mt-8 pb-4">
          <p className="text-[10px] font-bold text-slate-400 flex items-center justify-center gap-1">
            <span>Powered by</span>
            <span className="font-extrabold text-slate-600">Troxcard</span>
            <span className="w-4 h-4 rounded-md bg-[#7c3aed] text-white flex items-center justify-center text-[9px] font-black">
              T
            </span>
          </p>
        </div>

      </div>
    </div>
  )
}
