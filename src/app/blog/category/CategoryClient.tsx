"use client"

import { useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import PostCard from "@/components/blog/PostCard"
import Pagination from "@/components/blog/Pagination"
import { useMeta } from "@/components/blog/useMeta"
import { useTrackView } from "@/lib/admin-store"
import type { AdminPost, SiteSettings } from "@/lib/admin-store"

const categoryData: Record<string, { name: string; description: string }> = {
  ai: { name: "AI", description: "Latest in artificial intelligence — from LLMs to robotics" },
  gaming: { name: "Gaming", description: "Game reviews, previews, walkthroughs and industry analysis" },
  esports: { name: "Esports", description: "Tournament coverage, team rankings, and competitive play" },
  tech: { name: "Tech", description: "Hardware reviews, software tutorials, and emerging tech trends" },
}

function CategoryContent({ slug, cat, posts, settings }: {
  slug: string
  cat: { name: string; description: string } | null
  posts: AdminPost[]
  settings: SiteSettings
}) {
  const searchParams = useSearchParams()
  const trackView = useTrackView()

  useMeta(cat ? `${cat.name} — Blog` : "Category", cat?.description)

  useEffect(() => {
    trackView("blog-category", slug)
  }, [trackView, slug])

  if (!cat) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Category not found</h1>
          <p className="text-white/60 text-sm mb-6">The category you are looking for does not exist.</p>
          <Link href="/blog" className="text-white/60 hover:text-white transition-colors text-sm inline-flex items-center gap-1">
            &larr; Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const postsPerPage = settings.postsPerPage || 9
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))

  const allPosts = posts.filter(
    (p) => p.category.toLowerCase() === slug && p.status === "Published"
  )
  const totalPages = Math.max(1, Math.ceil(allPosts.length / postsPerPage))
  const currentPage = Math.min(page, totalPages)
  const displayed = allPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  const pagination = totalPages > 1 ? (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      basePath={`/blog/category/${slug}`}
      queryParams={{}}
    />
  ) : null

  const categoryPills = ["All", "AI", "Gaming", "Esports", "Tech"]

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <header className="mb-12 md:mb-16">
        <p className="text-accent text-xs font-semibold uppercase mb-2">{cat.name}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">{cat.name}</h1>
        <p className="mt-2 text-white/70 leading-relaxed max-w-xl">{cat.description}</p>
      </header>

      <div className="flex gap-8 mb-12" role="group" aria-label="Filter by category">
        {categoryPills.map((pill) => {
          const isActive = pill === "All"
            ? false
            : pill.toLowerCase() === slug
          return (
            <Link
              key={pill}
              href={pill === "All" ? "/blog" : `/blog/category/${pill.toLowerCase()}`}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-white font-medium"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {pill}
            </Link>
          )
        })}
      </div>

      {displayed.length > 0 ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayed.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>

          {pagination}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/60">No articles found in this category. Check back soon for new content.</p>
        </div>
      )}
    </div>
  )
}

export default function CategoryClient({ slug, cat, posts, settings }: {
  slug: string
  cat: { name: string; description: string } | null
  posts: AdminPost[]
  settings: SiteSettings
}) {
  return (
    <Suspense fallback={<div className="flex min-h-[400px] items-center justify-center"><p className="text-white/60">Loading articles...</p></div>}>
      <CategoryContent slug={slug} cat={cat} posts={posts} settings={settings} />
    </Suspense>
  )
}
