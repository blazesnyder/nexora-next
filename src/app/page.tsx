"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Link from "next/link"
import Image from "next/image"
import NewsletterSignup from "@/components/blog/NewsletterSignup"
import AdBanner from "@/components/ads/AdBanner"
import { useEffect, useMemo } from "react"
import { useTrackView, usePosts } from "@/lib/admin-store"
import Hero from "@/components/home/Hero"
import { formatDate } from "@/lib/date"

const categoryData = [
  {
    name: "AI",
    description: "Latest in artificial intelligence - from LLMs to robotics",
    href: "/blog/category/ai",
  },
  {
    name: "Gaming",
    description: "Reviews, previews, and industry insights",
    href: "/blog/category/gaming",
  },
  {
    name: "Esports",
    description: "Tournaments, teams, and competitive play",
    href: "/blog/category/esports",
  },
  {
    name: "Tech",
    description: "Hardware, software, and emerging trends",
    href: "/blog/category/tech",
  },
]

export default function HomePage() {
  const trackView = useTrackView()
  const posts = usePosts()

  useEffect(() => {
    trackView("home")
  }, [trackView])

  const publishedPosts = useMemo(
    () => posts.filter((p) => p.status === "Published"),
    [posts]
  )

  const sortedPosts = useMemo(
    () => [...publishedPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
    [publishedPosts]
  )

  const heroPosts = useMemo(() => sortedPosts.slice(0, 3), [sortedPosts])
  const latestPosts = useMemo(() => sortedPosts.slice(3, 9), [sortedPosts])
  const trendingPosts = useMemo(() => sortedPosts.slice(9, 14), [sortedPosts])

  const heroSlugs = useMemo(
    () => new Set(heroPosts.map((p) => p.slug)),
    [heroPosts]
  )

  const categoryArticles = useMemo(() => {
    const result: Record<string, typeof publishedPosts> = {}
    for (const cat of categoryData) {
      result[cat.name] = publishedPosts
        .filter((p) => p.category === cat.name && !heroSlugs.has(p.slug))
        .slice(0, 2)
    }
    return result
  }, [publishedPosts, heroSlugs])

  const categoryCounts = useMemo(
    () => publishedPosts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    [publishedPosts]
  )

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <Hero posts={posts} />

        <AdBanner format="leaderboard" />

        {/* Latest News + Trending */}
        {latestPosts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <div className="flex flex-col lg:flex-row gap-12">
                {/* Latest News Feed */}
                <div className="flex-1 min-w-0">
                  <p className="text-accent text-xs font-semibold uppercase mb-1">Latest</p>
                  <h2 className="text-2xl font-bold text-white mb-8">Latest News</h2>
                  <div className="divide-y divide-white/10">
                    {latestPosts.map((post) => (
                      <article key={post.slug} className="py-6 first:pt-0 last:pb-0">
                        <Link href={`/blog/${post.slug}`} className="flex flex-col sm:flex-row gap-5 group">
                          {post.featuredImage ? (
                            <div className="relative w-full sm:w-48 shrink-0 aspect-[16/9] overflow-hidden">
                              <Image
                                src={post.featuredImage}
                                alt=""
                                fill
                                className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                sizes="(max-width: 640px) 100vw, 192px"
                              />
                            </div>
                          ) : (
                            <div className="w-full sm:w-48 aspect-[16/9] bg-white/5 shrink-0" />
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-accent text-xs font-semibold uppercase mb-1">
                              {post.category}
                            </span>
                            <h3 className="text-lg font-bold text-white leading-snug mb-1">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-2">
                                {post.excerpt}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-white/40 text-sm mt-auto">
                              <span>By {post.authorEmail ? post.authorEmail.split("@")[0] : "Nexora Team"}</span>
                              <span>·</span>
                              <time dateTime={post.createdAt}>
                                {formatDate(post.createdAt)}
                              </time>
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                  <div className="mt-8">
                    <Link
                      href="/blog"
                      className="text-accent hover:text-white transition-colors font-medium text-sm inline-flex items-center gap-2"
                    >
                      View All Articles <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>

                {/* Trending Sidebar */}
                {trendingPosts.length > 0 && (
                  <aside className="w-full lg:w-80 shrink-0">
                    <p className="text-accent text-xs font-semibold uppercase mb-1">Trending</p>
                    <h2 className="text-2xl font-bold text-white mb-8">Popular</h2>
                    <div className="space-y-0">
                      {trendingPosts.map((post, i) => (
                        <Link
                          key={post.slug}
                          href={`/blog/${post.slug}`}
                          className="flex items-start gap-4 py-5 border-b border-white/10 last:border-b-0 group"
                        >
                          <span className="text-2xl font-bold text-white/20 shrink-0 w-8 leading-none">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <span className="text-accent text-xs font-semibold uppercase">{post.category}</span>
                            <h3 className="text-sm font-bold text-white leading-snug mt-0.5 group-hover:text-white/80 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-white/40 text-xs mt-1">
                              {formatDate(post.createdAt)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            </div>
          </section>
        )}

        <AdBanner format="leaderboard" />

        {/* Categories with Previews */}
        <section className="border-t border-white/10 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <p className="text-accent text-xs font-semibold uppercase mb-1">Browse</p>
            <h2 className="text-2xl font-bold text-white mb-10">Categories</h2>
            <div className="grid gap-8 sm:grid-cols-2">
              {categoryData.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="border border-white/10 p-8 hover:border-white/30 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                    <span className="text-white/40 text-sm">{categoryCounts[cat.name] || 0} articles</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{cat.description}</p>
                  {categoryArticles[cat.name]?.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                      {categoryArticles[cat.name].map((article) => (
                        <div key={article.slug} className="flex items-start gap-3">
                          {article.featuredImage ? (
                            <div className="relative w-14 h-14 shrink-0 overflow-hidden">
                              <Image
                                src={article.featuredImage}
                                alt=""
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 bg-white/5 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white leading-snug group-hover:text-white/80">
                              {article.title}
                            </p>
                            <p className="text-xs text-white/40 mt-0.5">
                              {formatDate(article.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AdBanner format="leaderboard" />

        <NewsletterSignup />
        <Footer />
      </main>
    </div>
  )
}