"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useState } from "react"
import { useAdminStore } from "@/lib/admin-store"
import AdBanner from "@/components/ads/AdBanner"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { addContact } = useAdminStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return
    setSubmitting(true)
    addContact({ name, email, subject, message })
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setSuccess(true)
    setSubmitting(false)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-accent text-xs font-semibold uppercase mb-2">Get in Touch</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-white/70 leading-relaxed max-w-xl">
              Have a question, suggestion, or collaboration idea? Fill out the form below and we will get back
              to you as soon as possible.
            </p>
          </div>

          <AdBanner format="leaderboard" className="mb-12" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <div>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-sm text-white/40 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={submitting}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-accent outline-none transition-colors disabled:opacity-50"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm text-white/40 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={submitting}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-accent outline-none transition-colors disabled:opacity-50"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm text-white/40 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      disabled={submitting}
                        className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-accent outline-none transition-colors disabled:opacity-50"
                        placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm text-white/40 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      disabled={submitting}
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white outline-none transition-colors resize-none disabled:opacity-50"
                      placeholder="Your message..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="text-accent hover:text-white transition-colors font-medium disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                  {success && (
                    <p className="text-sm text-white/60">
                      Message sent successfully! We&apos;ll get back to you soon.
                    </p>
                  )}
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/40">Email</p>
                      <a href="mailto:hello@nexora.com" className="text-white/60 hover:text-white transition-colors">hello@nexora.com</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/40">Location</p>
                      <p className="text-white/60">San Francisco, CA</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <div>
                      <p className="text-sm text-white/40">Social</p>
                      <div className="flex gap-3">
                        <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Twitter</a>
                        <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">GitHub</a>
                        <a href="#" className="text-white/50 hover:text-white transition-colors text-sm">Discord</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8">
                <h3 className="text-lg font-semibold text-white mb-3">Response Time</h3>
                <p className="text-white/60 leading-relaxed">
                  We typically respond within 24 hours on business days. For urgent matters, reach out on our social channels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
