"use client"

import { useState, useMemo } from "react"
import { useAdminStore } from "@/lib/admin-store"
import { hasPermission } from "@/lib/admin-auth"

export default function AnalyticsPage() {
  const { store, trackView } = useAdminStore()
  const [range, setRange] = useState<"7d" | "30d" | "90d">("30d")

  const now = new Date()
  const startDate = useMemo(() => {
    const d = new Date(now)
    if (range === "7d") d.setDate(d.getDate() - 7)
    else if (range === "30d") d.setDate(d.getDate() - 30)
    else d.setDate(d.getDate() - 90)
    return d
  }, [range])

  const filteredAnalytics = store.analytics.filter((a) => new Date(a.timestamp) >= startDate)

  const totalViews = filteredAnalytics.length
  const uniquePages = new Set(filteredAnalytics.map((a) => a.page)).size
  const postViews = filteredAnalytics.filter((a) => a.postSlug).length
  const uniquePosts = new Set(filteredAnalytics.filter((a) => a.postSlug).map((a) => a.postSlug)).size

  const viewsByDay = useMemo(() => {
    const days: Record<string, number> = {}
    filteredAnalytics.forEach((a) => {
      const day = new Date(a.timestamp).toISOString().split("T")[0]
      days[day] = (days[day] || 0) + 1
    })
    return Object.entries(days)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))
  }, [filteredAnalytics])

  const viewsByPage = useMemo(() => {
    const pages: Record<string, number> = {}
    filteredAnalytics.forEach((a) => {
      pages[a.page] = (pages[a.page] || 0) + 1
    })
    return Object.entries(pages)
      .sort(([, a], [, b]) => b - a)
      .map(([page, count]) => ({ page, count }))
  }, [filteredAnalytics])

  const viewsByPost = useMemo(() => {
    const posts: Record<string, { count: number; title: string }> = {}
    filteredAnalytics.forEach((a) => {
      if (a.postSlug) {
        const post = store.posts.find((p) => p.slug === a.postSlug)
        posts[a.postSlug!] = {
          count: (posts[a.postSlug!]?.count || 0) + 1,
          title: post?.title || a.postSlug,
        }
      }
    })
    return Object.entries(posts)
      .sort(([, a], [, b]) => b.count - a.count)
      .map(([slug, data]) => ({ slug, ...data }))
  }, [filteredAnalytics, store.posts])

  const topReferrers = useMemo(() => {
    const refs: Record<string, number> = {}
    filteredAnalytics.forEach((a) => {
      if (a.referrer) {
        try {
          const url = new URL(a.referrer)
          refs[url.hostname] = (refs[url.hostname] || 0) + 1
        } catch {
          refs["Direct / Unknown"] = (refs["Direct / Unknown"] || 0) + 1
        }
      } else {
        refs["Direct / Unknown"] = (refs["Direct / Unknown"] || 0) + 1
      }
    })
    return Object.entries(refs)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([referrer, count]) => ({ referrer, count }))
  }, [filteredAnalytics])

  return (
    <div className="flex h-screen flex-col bg-page">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-line bg-card/80 backdrop-blur px-6">
        <h1 className="text-xl font-bold">Analytics</h1>
        <div className="flex items-center gap-3">
          <div className="flex border border-line rounded-lg overflow-hidden">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-sm font-medium transition ${range === r ? "bg-accent text-white" : "text-secondary hover:text-primary"}`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard label="Total Views" value={totalViews.toLocaleString()} icon={<ViewsIcon />} />
          <StatCard label="Unique Pages" value={uniquePages} icon={<PagesIcon />} />
          <StatCard label="Post Views" value={postViews.toLocaleString()} icon={<PostIcon />} />
          <StatCard label="Posts Viewed" value={uniquePosts} icon={<PostIcon />} />
        </div>

        <div className="grid gap-5 lg:grid-cols-2 mb-8">
          <Card title="Views Over Time">
            <div className="h-64 flex items-end gap-1">
              {viewsByDay.length === 0 ? (
                <p className="text-secondary w-full text-center py-10">No data for this period</p>
              ) : (
                viewsByDay.map(({ date, count }, i) => (
                  <div key={date} className="flex-1 flex flex-col items-end">
                    <div
                      className="w-full bg-accent rounded-t transition-all hover:bg-accent/80"
                      style={{ height: `${Math.max(4, (count / Math.max(...viewsByDay.map((d) => d.count))) * 100)}%` }}
                    />
                    <span className="text-xs text-dim mt-1 transform -rotate-45 origin-bottom-left whitespace-nowrap">
                      {new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card title="Top Pages">
            {viewsByPage.length === 0 ? (
              <p className="text-secondary text-center py-8">No data</p>
            ) : (
              <div className="space-y-3">
                {viewsByPage.map(({ page, count }, i) => (
                  <div key={page} className="flex items-center gap-3">
                    <span className="w-6 text-center text-dim font-medium">{i + 1}</span>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-24 bg-line dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-accent h-full rounded-full transition-all duration-500"
                          style={{ width: `${(count / viewsByPage[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium truncate">{formatPageName(page)}</span>
                    </div>
                    <span className="w-16 text-right text-sm text-dim">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card title="Top Posts">
            {viewsByPost.length === 0 ? (
              <p className="text-secondary text-center py-8">No post views yet</p>
            ) : (
              <div className="space-y-3">
                {viewsByPost.slice(0, 10).map(({ slug, title, count }, i) => (
                  <div key={slug} className="flex items-center gap-3">
                    <span className="w-6 text-center text-dim font-medium">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{title}</p>
                      <p className="text-xs text-dim">/{slug}</p>
                    </div>
                    <span className="w-16 text-right text-sm text-dim">{count.toLocaleString()} views</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Top Referrers">
            {topReferrers.length === 0 ? (
              <p className="text-secondary text-center py-8">No referrer data</p>
            ) : (
              <div className="space-y-3">
                {topReferrers.map(({ referrer, count }, i) => (
                  <div key={referrer} className="flex items-center gap-3">
                    <span className="w-6 text-center text-dim font-medium">{i + 1}</span>
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-24 bg-line dark:bg-zinc-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-violet-500 h-full rounded-full"
                          style={{ width: `${(count / topReferrers[0].count) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium truncate">{referrer}</span>
                    </div>
                    <span className="w-16 text-right text-sm text-dim">{count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <Card title="" className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line bg-card-alt">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider">Page</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider">Post</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-dim uppercase tracking-wider">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {store.analytics.slice(0, 50).map((a) => (
                    <tr key={a.id} className="hover:bg-card-alt/50">
                      <td className="px-4 py-3 text-sm text-dim">{new Date(a.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-medium">{formatPageName(a.page)}</td>
                      <td className="px-4 py-3 text-sm">
                        {a.postSlug ? <a href={`/blog/${a.postSlug}`} className="text-accent hover:underline">/{a.postSlug}</a> : <span className="text-dim">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-dim truncate max-w-xs">
                        {a.referrer ? new URL(a.referrer).hostname : "Direct / Unknown"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="p-5 bg-card border border-line rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-dim">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">{icon}</div>
      </div>
    </div>
  )
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-line rounded-xl overflow-hidden ${className}`}>
      {title && <div className="px-5 py-4 border-b border-line"><h3 className="font-semibold">{title}</h3></div>}
      <div className="p-5">{children}</div>
    </div>
  )
}

function formatPageName(page: string): string {
  const map: Record<string, string> = {
    "/": "Home",
    "/blog": "Blog Index",
    "/blog/ai": "Blog: AI",
    "/blog/gaming": "Blog: Gaming",
    "/blog/esports": "Blog: Esports",
    "/blog/tech": "Blog: Tech",
    "/search": "Search",
    "/author/": "Author Page",
    "/contact": "Contact",
    "/about": "About",
  }
  if (page.startsWith("/blog/")) return `Blog Post: ${page.split("/").pop()}`
  if (page.startsWith("/author/")) return `Author: ${page.split("/").pop()}`
  if (page.startsWith("/blog/category/")) return `Category: ${page.split("/").pop()}`
  return map[page] || page
}

function ViewsIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5c0-6.874 5.496-12.438 12.248-12.526a1.125 1.125 0 011.504 0C16.254 1.062 21.75 6.626 21.75 13.5M12 18.75c-1.052 0-2.043-.377-2.835-.99a1.125 1.125 0 01.485-1.49c1.26.977 2.861 1.48 4.55 1.48 1.689 0 3.29-.503 4.55-1.48a1.125 1.125 0 01.486 1.49c-.793.613-1.784.99-2.835.99z" /></svg>
}

function PagesIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-1.5 0h1.5m-18.75 0v11.25A2.25 2.25 0 006 16.5h2.25m-7.5 7.5h13.5m-2.25 0A2.25 2.25 0 0121 18.75V7.5A2.25 2.25 0 0118.75 5.25H8.55m-2.25 0A2.25 2.25 0 003.75 7.5v8.25" /></svg>
}

function PostIcon() {
  return <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}