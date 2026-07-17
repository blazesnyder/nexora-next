"use client"

import { useState, useRef, useEffect } from "react"
import { LANGUAGES } from "@/lib/use-translation"
import FlagIcon from "./FlagIcon"

export default function LanguageDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (code: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const current = LANGUAGES.find((l) => l.code === value)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-line rounded-full px-3 py-1.5 text-[11px] font-medium text-secondary hover:text-primary hover:bg-card-alt hover:border-line-hover transition-all duration-300 cursor-pointer focus:outline-none focus:border-accent"
      >
        {current && <FlagIcon code={current.code} />}
        <span>{current?.native}</span>
        <svg className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-44 bg-page border border-line rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => { onChange(l.code); setOpen(false) }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-left transition-colors duration-150 ${
                l.code === value ? "bg-filter text-primary" : "text-secondary hover:bg-card-alt hover:text-primary"
              }`}
            >
              <FlagIcon code={l.code} />
              <span className="font-medium">{l.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
