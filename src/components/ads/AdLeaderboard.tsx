"use client"

import Script from "next/script"

export default function AdLeaderboard() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-[728px] h-[90px] bg-white/5 flex items-center justify-center overflow-hidden">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : '8f39a5c0424d2273edb89000da130479',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `,
          }}
        />
        <Script
          src="https://www.highperformanceformat.com/8f39a5c0424d2273edb89000da130479/invoke.js"
          strategy="lazyOnload"
        />
      </div>
    </div>
  )
}
