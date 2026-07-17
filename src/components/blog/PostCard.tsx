"use client"

import Link from "next/link"
import Image from "next/image"
import type { AdminPost } from "@/lib/admin-store"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getReadingTime(blocks: unknown[] | undefined): number {
  if (!blocks) return 0
  return Math.ceil(blocks.length / 3)
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className || ""}`} />
  )
}

function CategoryBadge({ category }: { category: string }) {
  const colors: Record<string, string> = {
    AI: "bg-purple-500/20 text-purple-400",
    Gaming: "bg-blue-500/20 text-blue-400",
    Esports: "bg-orange-500/20 text-orange-400",
    Tech: "bg-cyan-500/20 text-cyan-400",
  }
  const colorClass = colors[category] || colors.Tech
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${colorClass}`}>
      {category}
    </span>
  )
}

function Avatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-6 h-6 text-xs", md: "w-8 h-8 text-sm", lg: "w-10 h-10 text-base" }
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()
  return (
    <div className={`flex items-center justify-center rounded-full bg-white/10 ${sizes[size]}`}>
      {name ? initials : "??"}
    </div>
  )
}

export default function PostCard({ post }: { post: AdminPost }) {
  const authorName = post.authorEmail
    ? post.authorEmail.split("@")[0]
    : "Nexora Team"
  const readingTime = getReadingTime(post.blocks)

  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="flex flex-col md:flex-row gap-6 items-start group">
        {post.featuredImage ? (
          <div className="relative w-full md:w-56 aspect-[16/9] md:aspect-auto md:h-40 shrink-0 overflow-hidden">
            <Image
              src={post.featuredImage}
              alt=""
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 240px"
              placeholder="blur"
              loading="lazy"
            />
          </div>
        ) : (
          <Skeleton className="w-full md:w-56 aspect-[16/9] md:h-40 shrink-0" />
        )}

        <div className="flex flex-col min-w-0 flex-1">
          <CategoryBadge category={post.category} />
          <h2 className="text-xl font-bold text-white leading-snug mb-2 group-hover:text-white transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-auto pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Avatar name={authorName} size="sm" />
              <span>By {authorName}</span>
            </div>
            <span className="text-white/30">·</span>
            <time dateTime={post.createdAt} className="text-white/40 text-sm">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {post.blocks && (
              <span className="flex items-center gap-1 text-white/40 text-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{getReadingTime(post.blocks)} min read</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
