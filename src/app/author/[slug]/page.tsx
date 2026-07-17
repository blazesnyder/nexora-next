"use client"

import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import PostCard from "@/components/blog/PostCard"
import Pagination from "@/components/blog/Pagination"
import { useMeta } from "@/components/blog/useMeta"
import { usePosts, useUsers, useSettings, useTrackView } from "@/lib/admin-store"

function nameToSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function AuthorContent() {
  const { slug } = useParams<{ slug: string }>()
  const searchParams = useSearchParams()
  const posts = usePosts()
  const users = useUsers()
  const settings = useSettings()
  const trackView = useTrackView()
  const postsPerPage = settings.postsPerPage || 9
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"))

  const author = users.find(
    (u) => u.slug === slug || nameToSlug(u.name) === slug
  )

  useMeta(author ? `${author.name} — Author` : "Author", author?.bio, author?.avatar)
  useEffect(() => {
    trackView("author", slug)
  }, [trackView, slug])

  const allAuthorPosts = author
    ? posts.filter((p) => p.authorEmail === author.email && p.status === "Published")
    : []
  const totalPages = Math.max(1, Math.ceil(allAuthorPosts.length / postsPerPage))
  const currentPage = Math.min(page, totalPages)
  const authorPosts = allAuthorPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)

  if (!author) {
    return (
      <div className="flex min-h-screen flex-col bg-transparent text-white">
        <Header />
        <main className="mx-auto flex flex-1 flex-col items-center justify-center px-4">
          <h1 className="text-3xl font-bold text-white">Author not found</h1>
          <p className="mt-2 text-white/60">No author matches &ldquo;{slug}&rdquo;.</p>
          <Link href="/blog" className="mt-6 text-white/60 hover:text-white transition-colors font-medium">
            &larr; Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-white">
      <Header />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 md:px-8 py-16 md:py-20">
        <nav className="mb-10 flex items-center gap-2 text-sm text-white/60">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">Home</Link>
          <span className="text-white/30">/</span>
          <Link href="/blog" className="text-white/60 hover:text-white transition-colors">Blog</Link>
          <span className="text-white/30">/</span>
          <span className="text-white/60">{author.name}</span>
        </nav>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {author.avatar ? (
            <img src={author.avatar} alt="" className="w-20 h-20 flex-shrink-0 object-cover" />
          ) : (
            <div className="w-20 h-20 flex-shrink-0 bg-white/5 flex items-center justify-center text-2xl font-bold text-white">
              {author.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white">{author.name}</h1>
            {author.jobTitle && <p className="mt-1 text-sm text-white/60">{author.jobTitle}</p>}
            {author.bio && <p className="mt-3 max-w-xl text-white/70 leading-relaxed">{author.bio}</p>}
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
              {author.twitter && (
                <a href={`https://x.com/${author.twitter.replace("https://x.com/", "").replace("https://twitter.com/", "").replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/70 transition-colors text-sm">Twitter</a>
              )}
              {author.github && (
                <a href={author.github} target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/70 transition-colors text-sm">GitHub</a>
              )}
              {author.website && (
                <a href={author.website} target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white/70 transition-colors text-sm">Website</a>
              )}
            </div>
            {author.expertise && author.expertise.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {author.expertise.map((e: string) => (
                  <span key={e} className="text-white/40 text-sm">{e}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 my-12" />

        <h2 className="text-2xl font-bold text-white mb-8">
          Articles by {author.name}
        </h2>

        {allAuthorPosts.length > 0 && (
          <p className="mb-8 text-sm text-white/60">
            Showing {(currentPage - 1) * postsPerPage + 1}&ndash;{Math.min(currentPage * postsPerPage, allAuthorPosts.length)} of {allAuthorPosts.length} articles
          </p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {authorPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {authorPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl font-bold text-white mb-2">No articles yet</p>
            <p className="text-white/60">This author hasn&apos;t published any articles yet.</p>
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath={`/author/${slug}`} />
      </main>

      <Footer />
    </div>
  )
}

export default function AuthorPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col bg-transparent" />}>
      <AuthorContent />
    </Suspense>
  )
}
