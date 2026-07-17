'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface AdUnitProps {
  adSlot: string
  format?: string
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdUnit({
  adSlot,
  format = 'auto',
  className = '',
}: AdUnitProps) {
  const pathname = usePathname()
  const initialized = useRef(false)

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ''

  useEffect(() => {
    if (!clientId || initialized.current) return

    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      initialized.current = true
    } catch {
      // AdBlock or other ad blockers may throw an error
    }

    return () => {
      initialized.current = false
    }
  }, [clientId])

  if (!clientId) return null

  return (
    <div style={{ padding: 6 }}>
      <ins
        key={pathname}
        className={`adsbygoogle ${className}`.trim()}
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
