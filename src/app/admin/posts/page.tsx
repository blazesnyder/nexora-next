"use client"

import { useState } from "react"
import Link from "next/link"
import { useAdminStore } from "@/lib/admin-store"

const categoryMeta: Record<string, { gradient: string; text: string }> = {
  AI: { gradient: "from-violet-500 to-purple-600", text: "text-violet-400" },
  Gaming: { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-400" },
  Esports: { gradient: "from-amber-500 to-orange-600", text: "text-amber-400" },
  Tech: { gradient: "from-sky-500 to-blue-600", text: "text-sky-400" },
}

export default function AdminPosts() {
  const { store, deletePost, addActivity } = useAdminStore()
  const posts = store.posts
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)

  const currentName = typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("nexora_admin_auth") || "{}").name || "Admin"
    : "Admin"

  return (
    <div className="animate-fade-in space-y-6">
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm bg-card border border-line rounded-2xl p-6 shadow-2xl shadow-black/20 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-line">
              <div className="w-9 h-9 rounded-xl bg-red-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Delete Post</h2>
                <p className="text-xs text-dim mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-secondary mb-5">
              Are you sure you want to delete <strong className="text-primary">{confirmDelete.title}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl text-sm text-secondary hover:text-primary border border-line hover:bg-card-alt transition">Cancel</button>
              <button onClick={() => {
                deletePost(confirmDelete.id)
                addActivity("Deleted post", confirmDelete.title, currentName)
                setConfirmDelete(null)
              }}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Posts</h1>
          <p className="text-sm text-muted mt-1">
            {posts.filter((p) => p.status === "Published").length} published · {posts.filter((p) => p.status === "Draft").length} drafts
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover:shadow-accent/30"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          New Article
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card">
          <div className="p-12 md:p-20 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-filter">
              <svg className="h-12 w-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-primary">No articles yet</h3>
            <p className="mt-2 text-sm text-muted max-w-lg mx-auto leading-relaxed">
              Create your first article using the block editor — pick a template, use Quick Write with markdown, or build from scratch with drag-and-drop blocks.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <Link href="/admin/posts/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                Create Article
              </Link>
              <Link href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-line text-secondary hover:text-primary hover:bg-card-alt transition">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                View Site
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line bg-page/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-card-alt transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.featuredImage && (
                        <div className="w-10 h-10 rounded-lg bg-page overflow-hidden flex-shrink-0 border border-line">
                          <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-sm font-medium text-primary">{post.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${post.category === "AI" ? "badge-ai" : post.category === "Gaming" ? "badge-gaming" : post.category === "Esports" ? "badge-esports" : "badge-tech"}`}>
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
                      post.status === "Published"
                        ? "bg-emerald-900/30 text-emerald-400"
                        : "bg-amber-900/30 text-amber-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${post.status === "Published" ? "bg-emerald-400" : "bg-amber-400"}`} />
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/posts/${post.id}/edit`}
                        className="p-2 text-muted hover:text-primary hover:bg-card rounded-lg transition" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </Link>
                      <button onClick={() => setConfirmDelete({ id: post.id, title: post.title })}
                        className="p-2 text-muted hover:text-red-400 hover:bg-red-900/10 rounded-lg transition" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
