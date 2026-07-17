"use client"

import { useState } from "react"
import { useAdminStore } from "@/lib/admin-store"

export default function AdminSettings() {
  const { store, updateSettings, addActivity, clearActivity, resetData } = useAdminStore()
  const [form, setForm] = useState({ ...store.settings })
  const [saved, setSaved] = useState(false)
  const [confirmAction, setConfirmAction] = useState<"clear-logs" | "reset-data" | null>(null)

  const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("nexora_admin_auth") || "{}") : {}
  const currentName = user.name || "Admin"

  const hasChanges = form.siteName !== store.settings.siteName ||
    form.siteDescription !== store.settings.siteDescription ||
    form.postsPerPage !== store.settings.postsPerPage ||
    form.enableComments !== store.settings.enableComments

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(form)
    addActivity("Updated settings", "Site settings changed", currentName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleConfirm = () => {
    if (confirmAction === "clear-logs") {
      clearActivity()
      addActivity("Cleared activity logs", "All activity logs cleared by admin", currentName)
    } else if (confirmAction === "reset-data") {
      resetData()
    }
    setConfirmAction(null)
  }

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Settings</h1>
          <p className="text-sm text-muted mt-1">Manage your site configuration</p>
        </div>
        {hasChanges && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 bg-amber-900/15 border border-amber-800/25 px-3 py-1.5 rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            Unsaved changes
          </span>
        )}
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAction(null)}>
          <div className="w-full max-w-sm bg-card border border-line rounded-2xl p-6 shadow-2xl shadow-black/20 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-line">
              <div className="w-9 h-9 rounded-xl bg-red-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">
                  {confirmAction === "clear-logs" ? "Clear Activity Logs" : "Reset All Data"}
                </h2>
                <p className="text-xs text-dim mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-secondary mb-5">
              {confirmAction === "clear-logs"
                ? "Are you sure you want to clear all activity logs? This action cannot be reversed."
                : "Are you sure you want to reset all data? All posts, users, media, and settings will be permanently deleted."}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl text-sm text-secondary hover:text-primary border border-line hover:bg-card-alt transition">Cancel</button>
              <button onClick={handleConfirm}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition shadow-sm">
                {confirmAction === "clear-logs" ? "Clear Logs" : "Reset Everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-5 border-b border-line">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">General</p>
                  <p className="text-xs text-dim">Basic site information</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Site Name</label>
                <input type="text" value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Site Description</label>
                <textarea value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} rows={4}
                  className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition resize-none" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-5 border-b border-line">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Configuration</p>
                  <p className="text-xs text-dim">Site behavior and display</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Posts Per Page</label>
                <input type="number" min={1} max={50} value={form.postsPerPage}
                  onChange={(e) => setForm({ ...form, postsPerPage: parseInt(e.target.value) || 9 })}
                  className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
                <p className="text-xs text-dim mt-1.5">Number of posts displayed on blog listing pages</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-3">Enable Comments</label>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => setForm({ ...form, enableComments: !form.enableComments })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.enableComments ? "bg-accent" : "bg-filter"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.enableComments ? "translate-x-6" : "translate-x-0"}`} />
                  </button>
                  <span className="text-sm text-secondary">{form.enableComments ? "On" : "Off"}</span>
                  <span className="text-xs text-dim">Allow readers to comment on posts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-card overflow-hidden">
          <div className="px-6 lg:px-8 py-4 bg-page border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button type="submit" disabled={!hasChanges}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100">
                Save Changes
              </button>
              {saved && (
                <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Saved!
                </span>
              )}
              {hasChanges && !saved && (
                <span className="text-xs text-amber-400 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="rounded-2xl border border-red-900/25 bg-card overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex items-center gap-3 pb-5 border-b border-red-900/20 mb-6">
            <div className="w-9 h-9 rounded-xl bg-red-900/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-400">Danger Zone</p>
              <p className="text-xs text-dim">Irreversible actions — proceed with caution</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-red-900/20 bg-red-900/[0.03] p-5">
              <p className="text-sm font-medium text-primary mb-1">Clear Activity Logs</p>
              <p className="text-xs text-dim mb-4">Remove all entries from the activity log</p>
              <button onClick={() => setConfirmAction("clear-logs")}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-red-900/30 text-red-400 hover:bg-red-900/15 transition text-xs">
                Clear Logs
              </button>
            </div>
            <div className="rounded-xl border border-red-900/20 bg-red-900/[0.03] p-5">
              <p className="text-sm font-medium text-primary mb-1">Reset All Data</p>
              <p className="text-xs text-dim mb-4">Delete all posts, users, media, and settings</p>
              <button onClick={() => setConfirmAction("reset-data")}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600/15 text-red-400 hover:bg-red-600/25 transition">
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
