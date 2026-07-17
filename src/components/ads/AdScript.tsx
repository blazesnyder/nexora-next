import Script from 'next/script'

export default function AdScript() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''
  const isProduction = process.env.NODE_ENV === 'production'

  if (!isProduction || !clientId) return null

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />
  )
}
