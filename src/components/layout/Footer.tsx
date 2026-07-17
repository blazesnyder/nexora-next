import Link from "next/link"
import SiteLogo from "./SiteLogo"

export default function Footer() {
  const year = new Date().getFullYear()

  const sections = [
    { label: "Blog", href: "/blog" },
    { label: "AI", href: "/blog/category/ai" },
    { label: "Gaming", href: "/blog/category/gaming" },
    { label: "Esports", href: "/blog/category/esports" },
    { label: "Tech", href: "/blog/category/tech" },
  ]

  const company = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ]

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <SiteLogo />
            <span className="text-white/20 hidden sm:inline">|</span>
            <p className="text-sm text-white/40 hidden sm:block">
              AI, gaming, esports &amp; tech
            </p>
          </div>

          <div className="flex items-center gap-6">
            {sections.map(({ label, href }) => (
              <Link key={href} href={href} className="text-sm text-white/40 hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {company.map(({ label, href }) => (
              <Link key={href} href={href} className="text-sm text-white/40 hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {year} Nexora. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-white/30 hover:text-white transition-colors" aria-label="Twitter">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24-7.935 6.397L12 20.607l-7.14-7.728 8.47-9.24 7.193 7.728L21 2.25h-3.308l-7.34 8.185 8.385 9.214L3 20.607l7.314-7.588-8.344-9.188 7.256-7.728L0 1.929l7.387 7.738z" /></svg>
            </a>
            <a href="#" className="text-white/30 hover:text-white transition-colors" aria-label="GitHub">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
            </a>
            <a href="#" className="text-white/30 hover:text-white transition-colors" aria-label="RSS">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415a3.3 3.3 0 013.293 3.295A3.303 3.303 0 013.283 24C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
