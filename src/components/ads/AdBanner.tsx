"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const AD_CONFIGS = {
  leaderboard: {
    key: "8f39a5c0424d2273edb89000da130479",
    src: "https://www.highperformanceformat.com/8f39a5c0424d2273edb89000da130479/invoke.js",
    width: 728,
    height: 90,
    className: "w-[728px] h-[90px]",
  },
  rectangle: {
    key: "a903d1a077889e5a2938913f3b04db5d",
    src: "https://www.highperformanceformat.com/a903d1a077889e5a2938913f3b04db5d/invoke.js",
    width: 300,
    height: 250,
    className: "w-[300px] h-[250px]",
  },
}

type AdFormat = keyof typeof AD_CONFIGS

interface AdBannerProps {
  format: AdFormat
  className?: string
}

export default function AdBanner({ format, className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  useEffect(() => {
    if (isAdmin) return

    const container = containerRef.current
    if (!container) return

    container.innerHTML = ""

    const cfg = AD_CONFIGS[format]

    ;(window as any).atOptions = {
      key: cfg.key,
      format: "iframe",
      height: cfg.height,
      width: cfg.width,
      params: {},
    }

    const s = document.createElement("script")
    s.src = cfg.src
    s.async = false
    s.setAttribute("data-cfasync", "false")
    container.appendChild(s)

    return () => {
      container.innerHTML = ""
    }
  }, [format, isAdmin])

  if (isAdmin) return null

  const cfg = AD_CONFIGS[format]

  return (
    <div className={`flex justify-center ${className}`}>
      <div
        ref={containerRef}
        className={`${cfg.className} bg-white/5 flex items-center justify-center overflow-hidden`}
      />
    </div>
  )
}
