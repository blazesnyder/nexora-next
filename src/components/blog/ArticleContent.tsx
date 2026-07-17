"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/date"
import BlockRenderer from "@/components/blog/BlockRenderer"
import { useSettings } from "@/lib/admin-store"

interface ArticleContentProps {
  post: {
    slug: string
    title: string
    excerpt?: string
    featuredImage?: string
    category: string
    createdAt: string
    authorEmail?: string
    blocks?: unknown[]
  }
  settings: {
    siteName?: string
    postsPerPage?: number
  }
}

export default function ArticleContent({ post, settings }: ArticleContentProps) {
  const { siteName } = useSettings()

  const authorName = post.authorEmail ? post.authorEmail.split("@")[0] : "Nexora Team"

  return (
    <article className="flex-1">
      {post.featuredImage && (
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1 text-accent hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to Articles
          </Link>
        </div>

        <span className="text-accent text-xs font-semibold uppercase mb-3 inline-block">
          {post.category}
        </span>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-2 text-white/40 text-sm mb-8 flex-wrap">
          <span>By {authorName}</span>
          <span>·</span>
          <time dateTime={post.createdAt} suppressHydrationWarning>
            {formatDate(post.createdAt)}
          </time>
          {post.blocks && (
            <>
              <span>·</span>
              <span>{Math.ceil((post.blocks?.length || 0) / 3)} min read</span>
            </>
          )}
        </div>

        <div className="text-white/70 leading-relaxed text-lg max-w-none">
          {post.blocks ? (
            <BlockRenderer blocks={post.blocks} />
          ) : (
            <p className="text-white/70">No content available.</p>
          )}
        </div>

        <hr className="border-t border-white/10 my-16" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-accent">{authorName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-white">{authorName}</p>
              <p className="text-sm text-white/40">Official Nexora publication</p>
              <p className="text-xs text-white/40 mt-1">Covering AI, gaming, esports, and technology with depth and clarity.</p>
            </div>
          </div>
          <Link
            href="/posts"
            className="inline-flex items-center gap-1 text-accent hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to Articles
          </Link>
        </div>
      </div>
    </article>
  )
}
