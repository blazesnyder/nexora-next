"use client"

import Script from "next/script"

export default function AdsterraSocialBar() {
  return (
    <>
      <Script
        src="https://pl30399256.effectivecpmnetwork.com/fdff6bdc16ce487f09160f7bcf039002/invoke.js"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <div id="container-fdff6bdc16ce487f09160f7bcf039002" />
      <Script id="adsterra-at-options" strategy="afterInteractive">
        {`
          atOptions = {
            'key' : '8f39a5c0424d2273edb89000da130479',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `}
      </Script>
      <Script
        src="https://www.highperformanceformat.com/8f39a5c0424d2273edb89000da130479/invoke.js"
        strategy="afterInteractive"
      />
      <Script id="adsterra-at-options-2" strategy="afterInteractive">
        {`
          atOptions = {
            'key' : 'a903d1a077889e5a2938913f3b04db5d',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        `}
      </Script>
      <Script
        src="https://www.highperformanceformat.com/a903d1a077889e5a2938913f3b04db5d/invoke.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://pl30399277.effectivecpmnetwork.com/16/aa/0b/16aa0b9c9132774934d913c627295656.js"
        strategy="afterInteractive"
      />
    </>
  )
}
