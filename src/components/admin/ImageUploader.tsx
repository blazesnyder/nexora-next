"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useAdminStore } from "@/lib/admin-store"

export default function ImageUploader({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (url: string) => void
  label?: string
}) {
  const [tab, setTab] = useState<"url" | "upload" | "library">("url")
  const [urlInput, setUrlInput] = useState(value || "")
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const { store, addMedia, addActivity } = useAdminStore()
  const library = store.media
  const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("nexora_admin_auth") || "{}") : {}
  const currentName = user.name || "Admin"

  useEffect(() => {
    setUrlInput(value)
  }, [value])

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      onChange(dataUrl)
      addMedia({ url: dataUrl, filename: file.name, size: file.size, type: file.type, uploadedBy: currentName })
      addActivity("Uploaded image", file.name, currentName)
    }
    reader.readAsDataURL(file)
  }, [onChange, addMedia, addActivity, currentName])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-secondary">{label}</p>}

      <div className="flex gap-1 rounded-xl bg-page border border-line/50 p-1 w-fit">
        <TabButton active={tab === "url"} onClick={() => setTab("url")}>URL</TabButton>
        <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>Upload</TabButton>
        <TabButton active={tab === "library"} onClick={() => setTab("library")}>Library ({library.length})</TabButton>
      </div>

      {tab === "url" && (
        <div className="flex gap-2">
          <input
            value={urlInput}
            onChange={(e) => { setUrlInput(e.target.value); onChange(e.target.value) }}
            className="flex-1 bg-card border border-line rounded-lg px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-mono transition"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      {tab === "upload" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragging ? "border-accent bg-accent/5 scale-[1.01]" : "border-line hover:border-line-hover hover:bg-filter/50 bg-page"
          }`}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }} />
          <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-filter flex items-center justify-center">
            <svg className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <p className="text-sm text-muted">Drop an image or click to browse</p>
          <p className="text-xs text-dim mt-1">PNG, JPG, WebP, GIF</p>
        </div>
      )}

      {tab === "library" && (
        <div>
          {library.length === 0 ? (
            <p className="text-sm text-muted text-center py-8 bg-page rounded-xl border border-dashed border-line">No images in library yet</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
              {library.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onChange(item.url)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                    value === item.url ? "border-accent ring-1 ring-accent" : "border-transparent hover:border-line-hover hover:scale-[1.02]"
                  }`}
                >
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="relative rounded-xl overflow-hidden border border-line group bg-page">
          <img src={value} alt="Preview" className="w-full max-h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white text-xs opacity-0 group-hover:opacity-100 transition hover:bg-black/80 backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        active ? "bg-card text-primary shadow-sm border border-line/50" : "text-muted hover:text-secondary"
      }`}
    >
      {children}
    </button>
  )
}
