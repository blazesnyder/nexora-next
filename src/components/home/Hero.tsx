"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/date"

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-white/10 rounded ${className || ""}`} />
  )
}

export default function Hero({ posts }: { posts: any[] }) {
  const topPosts = posts
    .filter((p) => p.status === "Published")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  const [first, ...rest] = topPosts

  return (
    <section className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-accent text-xs font-semibold uppercase tracking-wider mb-6">Featured</p>
        {topPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {first && (
              <div className="lg:col-span-2">
                <Link href={`/blog/${first.slug}`} className="group block">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {first.featuredImage ? (
                      <Image
                        src={first.featuredImage}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full animate-pulse bg-white/10" />
                    )}
                  </div>
                  <div className="mt-5">
                    <span className="text-accent text-xs font-semibold uppercase mb-2 inline-block">
                      {first.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      {first.title}
                    </h2>
                    {first.excerpt && (
                      <p className="text-white/70 leading-relaxed mt-3 line-clamp-2">
                        {first.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-white/40 text-sm mt-4">
                      <span>By {first.authorEmail ? first.authorEmail.split("@")[0] : "Nexora Team"}</span>
                      <span>·</span>
                      <time dateTime={first.createdAt} suppressHydrationWarning>
                        {formatDate(first.createdAt)}
                      </time>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {rest.length > 0 && (
              <div className="flex flex-col gap-8">
                {rest.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {post.featuredImage ? (
                        <Image
                          src={post.featuredImage}
                          alt=""
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                          sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full animate-pulse bg-white/10" />
                      )}
                    </div>
                    <div className="mt-3">
                      <span className="text-accent text-xs font-semibold uppercase mb-1 inline-block">
                        {post.category}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-snug group-hover:text-white/80 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/40 text-sm mt-2">
                        <span>By {post.authorEmail ? post.authorEmail.split("@")[0] : "Nexora Team"}</span>
                        <span>·</span>
                        <time dateTime={post.createdAt} suppressHydrationWarning>
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="animate-pulse space-y-4 max-w-md mx-auto">
              <div className="h-8 bg-white/10 rounded w-3/4 mx-auto" />
              <div className="h-10 bg-white/10 rounded w-full mx-auto" />
              <div className="h-6 bg-white/10 rounded w-3/4 mx-auto" />
              <div className="h-6 bg-white/10 rounded w-1/2 mx-auto mt-2" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}