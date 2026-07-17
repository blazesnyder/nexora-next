"use client"

import Script from "next/script"

export default function AdRectangle() {
  return (
    <div className="flex justify-center my-8">
      <div className="w-[300px] h-[250px] bg-white/5 flex items-center justify-center overflow-hidden">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              atOptions = {
                'key' : 'a903d1a077889e5a2938913f3b04db5d',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            `,
          }}
        />
        <Script
          src="https://www.highperformanceformat.com/a903d1a077889e5a2938913f3b04db5d/invoke.js"
          strategy="lazyOnload"
        />
      </div>
    </div>
  )
}
