"use client"

import { usePathname } from "next/navigation"

const AD_CONFIGS = {
  leaderboard: {
    src: "https://www.highperformanceformat.com/8f39a5c0424d2273edb89000da130479",
    width: 728,
    height: 90,
    className: "w-[728px] h-[90px]",
  },
  rectangle: {
    src: "https://www.highperformanceformat.com/a903d1a077889e5a2938913f3b04db5d",
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
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/admin")

  if (isAdmin) return null

  const cfg = AD_CONFIGS[format]

  return (
    <div className={`flex justify-center ${className}`}>
      <iframe
        src={cfg.src}
        width={cfg.width}
        height={cfg.height}
        className={`${cfg.className} border-0 overflow-hidden`}
        loading="lazy"
        scrolling="no"
      />
    </div>
  )
}
