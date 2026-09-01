import { HeadContent, Scripts, createRootRoute, useLocation } from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const DISABLE_PINCH_ZOOM_SCRIPT = `(function(){try{document.addEventListener('gesturestart',function(e){e.preventDefault();},{passive:false});document.addEventListener('gesturechange',function(e){e.preventDefault();},{passive:false});document.addEventListener('gestureend',function(e){e.preventDefault();},{passive:false});document.addEventListener('touchstart',function(e){if(e.touches&&e.touches.length>1){e.preventDefault();}},{passive:false});}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no',
      },
      {
        title: 'TroxCard | Digital Business Card & Smart Sharing',
      },
      {
        name: 'description',
        content: 'Create, customize, and share your digital business card in a tap with TroxCard. NFC & QR code enabled smart networking.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:title',
        content: 'TroxCard - Digital Business Cards & Smart Networking',
      },
      {
        property: 'og:description',
        content: 'Share your professional profile instantly with TroxCard. Modern digital business cards with QR codes and analytics.',
      },
      {
        property: 'og:url',
        content: 'https://bcard.troxcard.in/',
      },
      {
        property: 'og:image',
        content: 'https://bcard.troxcard.in/logo.png',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        name: 'twitter:title',
        content: 'TroxCard - Digital Business Cards',
      },
      {
        name: 'twitter:description',
        content: 'Share your professional profile instantly with TroxCard.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [
      {
        src: 'https://accounts.google.com/gsi/client',
        async: true,
        defer: true,
      },
    ],
  }),
  notFoundComponent: DefaultNotFound,
  shellComponent: RootDocument,
})

function DefaultNotFound() {
  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-20 h-20 rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/30 shadow-xl">
        <span className="text-3xl font-black">404</span>
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight mb-2">Page Not Found</h1>
      <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
        The link or digital business card you are trying to access does not exist or has been moved.
      </p>
      <a 
        href="/" 
        className="px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 text-white font-bold text-xs rounded-2xl shadow-lg shadow-purple-500/25 transition no-underline inline-flex items-center gap-2"
      >
        Return to Home
      </a>
    </main>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const hideHeaderFooter = location.pathname === '/' || location.pathname.startsWith('/c/')

  return (
    <html lang="en" suppressHydrationWarning className="bg-[#2e1065]">
      <head>
        <style dangerouslySetInnerHTML={{ __html: `
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: #2e1065 !important;
            background-image: linear-gradient(to bottom, #7c3aed, #5b21b6, #2e1065) !important;
            color: #ffffff !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
          }
          img {
            max-width: 100%;
            height: auto;
          }
        ` }} />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: DISABLE_PINCH_ZOOM_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)] bg-gradient-to-b from-[#7c3aed] via-[#5b21b6] to-[#2e1065] min-h-screen text-white">
        {!hideHeaderFooter && <Header />}
        {children}
        {!hideHeaderFooter && <Footer />}
        <Scripts />
      </body>
    </html>
  )
}
