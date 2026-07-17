"use client"

import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useMemo, useState, useEffect, useRef } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { usePosts, useTrackView } from "@/lib/admin-store"
import AdBanner from "@/components/ads/AdBanner"

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase()
      ? <mark key={i} className="bg-white/10 text-white">{part}</mark>
      : part
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const posts = usePosts()
  const trackView = useTrackView()
  const urlQuery = searchParams.get("q") || ""

  useEffect(() => {
    trackView("search")
  }, [trackView])

  const [input, setInput] = useState(urlQuery)
  const [debounced, setDebounced] = useState(urlQuery)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setDebounced(input)
      if (input.trim()) {
        router.replace(`/search?q=${encodeURIComponent(input.trim())}`, { scroll: false })
      } else if (window.location.search) {
        router.replace("/search", { scroll: false })
      }
    }, 300)
    return () => clearTimeout(debounceRef.current)
  }, [input, router])

  const published = posts.filter((p) => p.status === "Published")

  const results = useMemo(() => {
    const q = debounced.trim().toLowerCase()
    if (!q) return []
    return published.filter(
      (p) => p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q)
    )
  }, [debounced, published])

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 md:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Search</h1>
          <p className="text-white/70 text-sm">Find articles across Nexora</p>
        </div>

        <AdBanner format="leaderboard" className="mb-12" />

        <div className="mb-12">
          <div className="relative">
            <svg className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent border-b border-white/20 py-3 pl-8 text-white placeholder:text-white/30 focus:border-accent outline-none transition-colors text-lg"
            />
            {input && (
              <button onClick={() => setInput("")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>

        {debounced.trim() ? (
          <>
            <p className="mb-8 text-sm text-white/60">
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{debounced}&rdquo;
            </p>
            {results.length > 0 ? (
              <ul className="divide-y divide-white/10">
                {results.map((post) => (
                  <li key={post.id} className="py-6 first:pt-0">
                    <Link href={`/blog/${post.slug}`} className="group">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white/30 text-xs font-medium uppercase tracking-[0.15em]">{post.category}</span>
                        <span className="text-white/40 text-sm">{new Date(post.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                      </div>
                      <h2 className="text-lg font-bold text-white group-hover:text-white/60 transition-colors">{highlightMatch(post.title, debounced)}</h2>
                      {post.excerpt && (
                        <p className="mt-1 text-white/70 leading-relaxed line-clamp-2">{highlightMatch(post.excerpt, debounced)}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl font-bold text-white mb-2">No results found</p>
                <p className="text-white/60">Try a different search term or <Link href="/blog" className="text-accent hover:text-white transition-colors font-medium">browse all articles</Link>.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-white/60 mb-1">Search the blog</p>
            <p className="text-white/60 text-sm">Enter a search term above to find articles across Nexora.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Suspense fallback={<div className="flex-1" />}>
        <SearchContent />
      </Suspense>
    </div>
  )
}
