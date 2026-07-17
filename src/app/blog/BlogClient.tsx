"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import PostCard from "@/components/blog/PostCard"
import AdBanner from "@/components/ads/AdBanner"
import Pagination from "@/components/blog/Pagination"
import { useMeta } from "@/components/blog/useMeta"
import { useTrackView } from "@/lib/admin-store"
import type { AdminPost, SiteSettings } from "@/lib/admin-store"

const categories = ["All", "AI", "Gaming", "Esports", "Tech"]

function BlogContent({ posts, settings }: { posts: AdminPost[]; settings: SiteSettings }) {
  useMeta("Blog", "Latest news and articles across AI, Gaming, Esports & Tech")
  const searchParams = useSearchParams()
  const router = useRouter()
  const trackView = useTrackView()
  const [activeFilter, setActiveFilter] = useState("All")

  useEffect(() => {
    trackView("blog-index")
  }, [trackView])

  const postsPerPage = settings.postsPerPage || 9
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === "All") return true
    return p.category === activeFilter
  })

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage))
  const currentPage = Math.min(page, totalPages)
  const displayed = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <header className="mb-12 md:mb-16">
        <p className="text-accent text-xs font-semibold uppercase mb-2">Articles</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">Blog</h1>
        <p className="mt-2 text-white/70 leading-relaxed max-w-xl">Latest news and articles across AI, Gaming, Esports & Tech</p>
      </header>

      <AdBanner format="leaderboard" className="mb-8" />
      <div className="flex gap-8 mb-12" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveFilter(cat)
              if (cat === "All") {
                router.replace("/blog", { scroll: false })
              } else {
                router.replace(`/blog/category/${cat.toLowerCase()}`, { scroll: false })
              }
            }}
            className={`text-sm font-medium transition-colors ${
              activeFilter === cat
                ? "text-white font-medium"
                : "text-white/40 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {displayed.length > 0 ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog"
              queryParams={{ filter: activeFilter !== "All" ? activeFilter : undefined }}
            />
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/60">No articles found in this category. Try selecting a different filter.</p>
        </div>
      )}
    </div>
  )
}

export default function BlogClient({ posts, settings }: { posts: AdminPost[]; settings: SiteSettings }) {
  return (
    <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center"><p className="text-white/60">Loading articles...</p></div>}>
      <BlogContent posts={posts} settings={settings} />
    </Suspense>
  )
}
