"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import translations from "./translations.json"

export const LANGUAGES: { code: string; label: string; native: string; flag: string }[] = [
  { code: "en", label: "English", native: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", native: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { code: "de", label: "German", native: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "Japanese", native: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "Korean", native: "한국어", flag: "🇰🇷" },
  { code: "zh", label: "Chinese", native: "中文", flag: "🇨🇳" },
  { code: "pt", label: "Portuguese", native: "Português", flag: "🇵🇹" },
  { code: "ru", label: "Russian", native: "Русский", flag: "🇷🇺" },
  { code: "ar", label: "Arabic", native: "العربية", flag: "🇸🇦" },
]

const VALID_CODES = LANGUAGES.map((l) => l.code)

type Lang = (typeof VALID_CODES)[number]

type LangContextType = {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("nexora-lang") as Lang | null
    if (stored && VALID_CODES.includes(stored)) setLangState(stored)
    setMounted(true)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem("nexora-lang", l)
    document.documentElement.lang = l === "ar" ? "ar" : "en"
  }, [])

  const t = useCallback((key: string): string => {
    const dict = (translations as Record<string, Record<string, string>>)[lang]
    if (dict?.[key]) return dict[key]
    const fallback = (translations as Record<string, Record<string, string>>).en?.[key]
    return fallback || key
  }, [lang])

  const currentLang = mounted ? lang : "en"
  const value = { lang: currentLang, setLang, t } as LangContextType

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  )
}

export const useTranslation = () => useContext(LangContext)
