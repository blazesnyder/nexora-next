"use client"

import { useState, useRef } from "react"
import { useAdminStore } from "@/lib/admin-store"

export default function AdminMedia() {
  const { store, addMedia, deleteMedia, addActivity } = useAdminStore()
  const [urlInput, setUrlInput] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; filename: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("nexora_admin_auth") || "{}") : {}
  const currentName = user.name || "Admin"

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return
      if (file.size > 10 * 1024 * 1024) { alert("File must be under 10MB"); return }
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        addMedia({
          url,
          filename: file.name,
          size: file.size,
          type: file.type,
          uploadedBy: currentName,
        })
        addActivity("Uploaded image", file.name, currentName)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleUrlAdd = () => {
    if (!urlInput.trim()) return
    const filename = urlInput.split("/").pop() || "image.png"
    addMedia({
      url: urlInput.trim(),
      filename,
      size: 0,
      type: "image/url",
      uploadedBy: currentName,
    })
    addActivity("Added image from URL", filename, currentName)
    setUrlInput("")
  }

  const handleDelete = () => {
    if (!confirmDelete) return
    deleteMedia(confirmDelete.id)
    addActivity("Deleted image", confirmDelete.filename, currentName)
    setConfirmDelete(null)
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return ""
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Media</h1>
        <p className="text-sm text-muted mt-1">{store.media.length} file{(store.media.length !== 1) && "s"} in library</p>
      </div>

      <div className="rounded-2xl border border-line bg-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
              placeholder="Paste image URL..."
              className="flex-1 bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
            />
            <button onClick={handleUrlAdd} disabled={!urlInput.trim()}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition disabled:opacity-50"
            >Add URL</button>
          </div>
          <div className="text-xs text-dim flex items-center justify-center">or</div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e.target.files)} className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="w-full md:w-auto px-4 py-2.5 rounded-xl text-sm font-medium border border-dashed border-line text-secondary hover:text-primary hover:border-accent hover:bg-accent/5 transition"
            >Upload Files</button>
          </div>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileUpload(e.dataTransfer.files) }}
          className={`mt-4 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${dragOver ? "border-accent bg-accent/5" : "border-line bg-page"}`}
        >
          <svg className="w-8 h-8 mx-auto mb-3 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          <p className="text-sm text-muted">Drag & drop images here</p>
          <p className="text-xs text-dim mt-1">PNG, JPG, WebP, GIF — max 10MB</p>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm bg-card border border-line rounded-2xl p-6 shadow-2xl shadow-black/20 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-line">
              <div className="w-9 h-9 rounded-xl bg-red-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Delete Image</h2>
                <p className="text-xs text-dim mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-secondary mb-1">Delete <span className="font-semibold text-primary">{confirmDelete.filename}</span>?</p>
            <p className="text-xs text-dim mb-5">The image will be permanently removed from the library.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl text-sm text-secondary hover:text-primary border border-line hover:bg-card-alt transition">Cancel</button>
              <button onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {store.media.length === 0 ? (
        <div className="rounded-2xl border border-line bg-card p-16 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-filter">
            <svg className="h-10 w-10 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
          </div>
          <h3 className="text-lg font-semibold text-primary">No media yet</h3>
          <p className="mt-1 text-sm text-muted">Upload images or add URLs to build your media library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {store.media.map((item) => (
            <div key={item.id} className="group relative rounded-2xl border border-line bg-card overflow-hidden hover:border-line-hover hover:shadow-sm transition-all">
              <div className="aspect-square bg-page">
                <img src={item.url} alt={item.filename} className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666'><rect width='24' height='24' rx='4'/><text x='12' y='16' text-anchor='middle' font-size='14' fill='%23999'>?</text></svg>" }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <button onClick={() => setConfirmDelete({ id: item.id, filename: item.filename })}
                  className="p-1.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition" title="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
              <div className="p-3">
                <p className="text-xs text-primary truncate font-medium">{item.filename}</p>
                <p className="text-[11px] text-dim truncate mt-0.5">{formatSize(item.size)}{item.size > 0 && " • "}{new Date(item.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
