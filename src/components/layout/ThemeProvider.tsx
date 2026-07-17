"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type Theme = "light" | "dark" | "system"
type Resolved = "light" | "dark"

type ThemeContextType = {
  theme: Theme
  resolved: Resolved
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  resolved: "dark",
  setTheme: () => {},
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>("dark")
  const [resolved, setResolved] = useState<Resolved>("dark")

  useEffect(() => {
    const stored = localStorage.getItem("nexora-theme") as Theme | null
    if (stored) setThemeState(stored)
    setMounted(true)
  }, [])

  const applyTheme = useCallback((t: Theme) => {
    const media = window.matchMedia("(prefers-color-scheme: light)")
    let r: Resolved
    if (t === "system") {
      r = media.matches ? "light" : "dark"
    } else {
      r = t
    }
    setResolved(r)
    if (t === "system") {
      document.documentElement.removeAttribute("data-theme")
    } else {
      document.documentElement.setAttribute("data-theme", t)
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
    const media = window.matchMedia("(prefers-color-scheme: light)")
    const handler = () => {
      if (theme === "system") applyTheme("system")
    }
    media.addEventListener("change", handler)
    return () => media.removeEventListener("change", handler)
  }, [theme, applyTheme])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    localStorage.setItem("nexora-theme", t)
  }, [])

  const toggle = useCallback(() => {
    const next = resolved === "dark" ? "light" : "dark"
    setTheme(next)
  }, [resolved, setTheme])

  return (
    <ThemeContext.Provider value={{ theme: mounted ? theme : "dark", resolved, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
