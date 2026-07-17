"use client"

import Link from "next/link"
import { useAdminStore, type ActivityEntry } from "@/lib/admin-store"
import { hasPermission } from "@/lib/admin-auth"

const statCards = [
  {
    label: "Total Posts", getValue: (s: ReturnType<typeof useAdminStore>["store"]) => s.posts.length, getLink: "/admin/posts",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  },
  {
    label: "Users", getValue: (s: ReturnType<typeof useAdminStore>["store"]) => s.users.length, getLink: "/admin/users",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  },
  {
    label: "Media Files", getValue: (s: ReturnType<typeof useAdminStore>["store"]) => s.media.length, getLink: "/admin/media",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>,
  },
  {
    label: "Categories", getValue: () => 4, getLink: "/admin/categories",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
  },
  {
    label: "Drafts", getValue: (s: ReturnType<typeof useAdminStore>["store"]) => s.posts.filter((p) => p.status === "Draft").length, getLink: "/admin/posts",
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
  },
]

const quickActions = [
  { label: "New Article", href: "/admin/posts/new", desc: "Create with block editor",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> },
  { label: "All Posts", href: "/admin/posts", desc: "Manage articles",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg> },
  { label: "Media Library", href: "/admin/media", desc: "Upload & manage images",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg> },
  { label: "View Site", href: "/", desc: "See the frontend",
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
]

const categoryMeta: Record<string, { icon: string; text: string }> = {
  AI: { icon: "🤖", text: "text-secondary" },
  Gaming: { icon: "🎮", text: "text-secondary" },
  Esports: { icon: "🏆", text: "text-secondary" },
  Tech: { icon: "💻", text: "text-secondary" },
}

const roleBadge: Record<string, string> = {
  "Full Access": "bg-filter text-primary",
  Admin: "bg-filter text-primary",
  Editor: "bg-filter text-primary",
  Author: "bg-filter text-primary",
}

const activityIcons: Record<string, React.ReactNode> = {
  Created: <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  Updated: <svg className="w-3.5 h-3.5 text-accent-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>,
  Deleted: <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  Uploaded: <svg className="w-3.5 h-3.5 text-accent-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>,
  Added: <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  Changed: <svg className="w-3.5 h-3.5 text-accent-alt" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>,
}

export default function AdminDashboard() {
  const { store } = useAdminStore()

  const publishedPosts = store.posts.filter((p) => p.status === "Published").length
  const draftPosts = store.posts.filter((p) => p.status === "Draft").length
  const totalUsers = store.users.length
  const totalMedia = store.media.length
  const recentActivity = store.activity.slice(0, 8)
  const categoryCounts: Record<string, number> = { AI: 0, Gaming: 0, Esports: 0, Tech: 0 }
  store.posts.forEach((p) => { if (categoryCounts[p.category] !== undefined) categoryCounts[p.category]++ })

  const maxCategoryCount = Math.max(1, ...Object.values(categoryCounts))

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="heading-md">Dashboard</h1>
          <p className="text-sm text-muted mt-2">
            <span className="text-primary font-medium">{publishedPosts}</span> published · <span className="text-primary font-medium">{draftPosts}</span> drafts · <span className="text-primary font-medium">{totalUsers}</span> users · <span className="text-primary font-medium">{totalMedia}</span> media
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-dim">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          All systems normal
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((s) => {
          const val = s.getValue(store)
          return (
            <Link
              key={s.label}
              href={s.getLink}
              className="group relative rounded-2xl border border-line bg-card overflow-hidden transition-all duration-200 hover:border-line-hover hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-filter mb-4 group-hover:scale-110 transition-transform duration-200">
                  <span className="text-muted group-hover:text-accent transition-colors duration-200">{s.icon}</span>
                </div>
                <p className="text-2xl font-bold text-primary">{val}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.entries(categoryCounts) as [string, number][]).map(([cat, count]) => {
          const meta = categoryMeta[cat]
          return (
            <Link
              key={cat}
              href={`/blog/category/${cat.toLowerCase()}`}
              className="group relative rounded-2xl border border-line bg-card overflow-hidden transition-all duration-200 hover:border-line-hover hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{meta.icon}</span>
                    <span className={`text-sm font-medium ${meta.text}`}>{cat}</span>
                  </div>
                  <span className="text-xl font-bold text-muted group-hover:text-primary transition-colors">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-page overflow-hidden">
                  <div className="h-full rounded-full bg-accent/20 transition-all duration-500" style={{ width: `${(count / maxCategoryCount) * 100}%` }} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-sm font-semibold text-primary mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="flex items-center gap-3 p-4 rounded-2xl border border-line transition-all duration-200 group hover:border-line-hover hover:bg-card-alt hover:shadow-sm"
              >
                <span className="flex-shrink-0 text-muted group-hover:text-accent transition-colors">
                  {a.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{a.label}</p>
                  <p className="text-xs text-muted mt-0.5">{a.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6">
          <h2 className="text-sm font-semibold text-primary mb-5">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <div className="text-center py-10">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-page border border-dashed border-line">
                <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-sm text-dim">No activity yet</p>
              <p className="text-xs text-muted mt-1">Actions like creating posts and uploading media will appear here</p>
            </div>
          ) : (
            <div className="space-y-0">
              {recentActivity.map((a: ActivityEntry) => {
                const actionKey = Object.keys(activityIcons).find((k) => a.action.startsWith(k))
                return (
                  <div key={a.id} className="relative flex items-start gap-3 pb-4 last:pb-0">
                    <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-page border border-line flex items-center justify-center">
                      {actionKey ? activityIcons[actionKey] : <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-primary leading-snug">
                        <span className="font-semibold text-accent">{a.user}</span>
                        {" "}{a.action.toLowerCase()}
                      </p>
                      <p className="text-sm text-muted mt-0.5">{a.detail}</p>
                      <p className="text-[11px] text-dim mt-1">{formatTimeAgo(a.timestamp)}</p>
                    </div>
                  </div>
                )
              })}
              {store.activity.length > 8 && (
                <Link href="/admin/settings" className="block text-xs text-accent hover:underline text-center pt-3 mt-2 border-t border-line">
                  View all {store.activity.length} activity entries
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-line bg-card overflow-hidden">
          <div className="p-6 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-filter flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              </div>
              <h2 className="text-sm font-semibold text-primary">Users</h2>
            </div>
            {hasPermission("admin") && (
              <Link href="/admin/users" className="text-xs text-accent hover:underline">View all</Link>
            )}
          </div>
          {store.users.slice(0, 5).length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-dim">No users yet</p>
            </div>
          ) : (
            <div className="p-6 pt-5">
              {store.users.slice(0, 5).map((u, i) => (
                <div key={u.id} className={`flex items-center justify-between py-3 ${i < Math.min(store.users.length, 5) - 1 ? "border-b border-line" : ""} hover:bg-card-alt -mx-2 px-2 rounded-xl transition-colors`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-white text-xs font-bold uppercase flex-shrink-0 shadow-sm">
                      {u.name.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{u.name}</p>
                      <p className="text-xs text-dim truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 flex-shrink-0 ml-3">
                    {u.roles.map((r: string) => (
                      <span key={r} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadge[r] || "bg-filter text-muted"}`}>{r}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-line bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-filter flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
              </div>
              <h2 className="text-sm font-semibold text-primary">Media</h2>
            </div>
            {hasPermission("editor") && (
              <Link href="/admin/media" className="text-xs text-accent hover:underline">View all</Link>
            )}
          </div>
          {store.media.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-page border border-dashed border-line">
                <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
              </div>
              <p className="text-sm text-dim">No media uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {store.media.slice(0, 10).map((m) => (
                <div key={m.id} className="group aspect-square rounded-xl bg-page overflow-hidden border border-line hover:border-accent/50 hover:shadow-sm transition-all">
                  <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                </div>
              ))}
              {store.media.length > 10 && (
                <div className="aspect-square rounded-xl bg-page border border-dashed border-line flex items-center justify-center hover:border-accent/50 transition-colors">
                  <span className="text-xs font-bold text-muted">+{store.media.length - 10}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}
