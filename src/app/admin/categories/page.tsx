"use client"

import { useState } from "react"
import Link from "next/link"
import { useAdminStore } from "@/lib/admin-store"

const categories = [
  { name: "AI", textColor: "text-violet-400", gradient: "from-violet-500 to-purple-600", icon: "🤖" },
  { name: "Gaming", textColor: "text-emerald-400", gradient: "from-emerald-500 to-teal-600", icon: "🎮" },
  { name: "Esports", textColor: "text-amber-400", gradient: "from-amber-500 to-orange-600", icon: "🏆" },
  { name: "Tech", textColor: "text-sky-400", gradient: "from-sky-500 to-blue-600", icon: "💻" },
]

export default function AdminCategories() {
  const { store } = useAdminStore()
  const [hovered, setHovered] = useState<string | null>(null)

  const getCount = (name: string) => store.posts.filter((p) => p.category === name).length
  const maxCount = Math.max(1, ...categories.map((c) => getCount(c.name)))

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Categories</h1>
        <p className="text-sm text-muted mt-1">Organize your content by topic</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {categories.map((cat) => {
          const count = getCount(cat.name)
          const pct = (count / maxCount) * 100
          const isHovered = hovered === cat.name
          return (
            <div
              key={cat.name}
              onMouseEnter={() => setHovered(cat.name)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl border border-line bg-card overflow-hidden transition-all duration-200 hover:border-line-hover hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${cat.gradient} transition-all duration-300 ${isHovered ? "h-2" : ""}`} />

              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl transition-transform duration-300 ${isHovered ? "scale-110" : ""}`}>{cat.icon}</span>
                    <div>
                      <h3 className={`text-lg font-bold text-primary ${cat.textColor}`}>{cat.name}</h3>
                      <p className="text-xs text-dim mt-0.5">{count} article{count !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <span className={`text-3xl font-bold ${cat.textColor} transition-opacity duration-200 ${isHovered ? "opacity-60" : "opacity-30"}`}>{count}</span>
                </div>

                <div className="h-2 rounded-full bg-page overflow-hidden mb-5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.gradient} transition-all duration-500 ease-out`}
                    style={{ width: isHovered ? `${Math.min(pct + 10, 100)}%` : `${pct}%` }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/category/${cat.name.toLowerCase()}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-line text-secondary hover:text-primary hover:bg-card-alt hover:border-line-hover transition-all"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0l-5.25 5.25M21 3l-5.25 5.25" /></svg>
                    View Posts
                  </Link>
                  {count > 0 && (
                    <span className="text-xs text-dim">· {count} published</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
