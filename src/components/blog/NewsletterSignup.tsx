"use client"

import { useState, FormEvent } from "react"

const KEY = "nexora_newsletter_emails"

function getEmails(): string[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]") } catch { return [] }
}

function saveEmail(email: string) {
  const list = getEmails()
  if (!list.includes(email)) {
    list.push(email)
    localStorage.setItem(KEY, JSON.stringify(list))
  }
}

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email")
      return
    }
    saveEmail(email)
    setSubscribed(true)
    setEmail("")
  }

  if (subscribed) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <p className="text-white/50">Thanks for subscribing!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-accent text-xs font-semibold uppercase mb-2">Newsletter</p>
        <h2 className="text-2xl font-bold text-white mb-2">Stay in the loop</h2>
        <p className="text-white/50 mb-6">
          Get the latest articles and insights delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-transparent border-b border-white/20 py-2 text-white placeholder:text-white/30 focus:border-accent outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="text-accent hover:text-white transition-colors font-medium inline-flex items-center gap-2"
            >
              Subscribe →
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <p className="text-xs text-white/40 mt-3">No spam. Unsubscribe anytime.</p>
        </form>
      </div>
    </section>
  )
}
