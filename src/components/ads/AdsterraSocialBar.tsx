"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"

export default function AdsterraSocialBar() {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null

  return (
    <Script
      src="https://pl30399277.effectivecpmnetwork.com/16/aa/0b/16aa0b9c9132774934d913c627295656.js"
      strategy="afterInteractive"
    />
  )
}
