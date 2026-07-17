"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "./ThemeProvider"
import { useTranslation, LANGUAGES } from "@/lib/use-translation"
import SiteLogo from "./SiteLogo"
import LanguageDropdown from "@/components/ui/LanguageDropdown"

const navLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/blog/category/ai", label: "AI" },
  { href: "/blog/category/gaming", label: "Gaming" },
  { href: "/blog/category/esports", label: "Esports" },
  { href: "/blog/category/tech", label: "Tech" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { resolved, toggle } = useTheme()
  const { t, lang, setLang } = useTranslation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href === "/about") return pathname === "/about"
    if (href === "/contact") return pathname === "/contact"
    if (href === "/blog") return pathname === "/blog"
    if (href.startsWith("/blog/category/")) return pathname.startsWith(href)
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className={`relative flex items-center justify-between transition-all duration-500 my-4 md:my-6 rounded-full px-4 md:px-6 py-2 md:py-2.5`}>
        <div className={`absolute inset-0 rounded-full border transition-all duration-500 ${scrolled ? "opacity-100 bg-page/30 backdrop-blur-xl border-line shadow-lg" : "opacity-0 bg-page/30 border-transparent"}`} />
        <div className="relative z-10 flex items-center justify-between w-full">
        <SiteLogo />

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const translated = label === "Blog" ? t("nav.blog") : label === "AI" ? t("nav.ai") : label === "Gaming" ? t("nav.gaming") : label === "Esports" ? t("nav.esports") : label === "Tech" ? t("nav.tech") : label === "About" ? t("nav.about") : label === "Contact" ? t("nav.contact") : label
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive(href)
                    ? "text-primary bg-filter shadow-sm"
                    : "text-white/90 hover:text-primary hover:bg-white/10"
                }`}
              >
                {translated}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/search"
            className="rounded-full p-2 text-white/90 hover:text-primary hover:bg-white/10 transition-all duration-300"
            aria-label="Search"
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>
          <button
            onClick={toggle}
            className="rounded-full p-2 text-white/90 hover:text-primary hover:bg-white/10 transition-all duration-300"
            aria-label={resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {resolved === "dark" ? (
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>
          <LanguageDropdown value={lang} onChange={(code) => setLang(code as typeof lang)} />
        </div>

        <button
          className="rounded-full p-2.5 text-white/90 hover:text-primary hover:bg-white/10 md:hidden transition-all duration-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
            {mobileOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
        </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-page/95 backdrop-blur-xl px-6 pb-6 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1 pt-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? "bg-filter text-primary"
                    : "text-secondary hover:bg-card-alt hover:text-primary"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 pt-4 mt-4 border-t border-line">
            <Link
              href="/search"
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-secondary hover:bg-card-alt hover:text-primary transition-all duration-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              Search
            </Link>
            <button
              onClick={toggle}
              className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-secondary hover:bg-card-alt hover:text-primary transition-all duration-200"
            >
              {resolved === "dark" ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
              {resolved === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <div className="flex-1">
              <LanguageDropdown value={lang} onChange={(code) => { setLang(code as typeof lang); setMobileOpen(false) }} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
