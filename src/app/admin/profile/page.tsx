"use client"

import { useState, useEffect } from "react"
import { useAdminStore } from "@/lib/admin-store"
import { getSession } from "@/lib/admin-auth"

const roleBadge: Record<string, string> = {
  "Full Access": "bg-violet-900/30 text-violet-400",
  Admin: "bg-violet-900/30 text-violet-400",
  Editor: "bg-blue-900/30 text-blue-400",
  Author: "bg-emerald-900/30 text-emerald-400",
}

const categoryOptions = ["AI", "Gaming", "Esports", "Tech"]

const timezoneOptions = [
  "UTC-12:00", "UTC-11:00", "UTC-10:00", "UTC-09:00", "UTC-08:00", "UTC-07:00",
  "UTC-06:00", "UTC-05:00", "UTC-04:00", "UTC-03:00", "UTC-02:00", "UTC-01:00",
  "UTC+00:00", "UTC+01:00", "UTC+02:00", "UTC+03:00", "UTC+04:00", "UTC+05:00",
  "UTC+05:30", "UTC+06:00", "UTC+07:00", "UTC+08:00", "UTC+09:00", "UTC+10:00",
  "UTC+11:00", "UTC+12:00",
]

const languageOptions = ["English", "Filipino", "Spanish", "Japanese", "Korean", "Chinese"]

type ProfileForm = {
  name: string; bio: string; website: string; avatar: string
  jobTitle: string; expertise: string[]; slug: string; showOnAuthors: boolean
  twitter: string; github: string; linkedin: string; youtube: string; twitch: string
  theme: "light" | "dark" | "system"; timezone: string; language: string
  notifyComments: boolean; notifyUsers: boolean; notifyDigest: boolean
  twoFactorEnabled: boolean
}

const emptyForm: ProfileForm = {
  name: "", bio: "", website: "", avatar: "",
  jobTitle: "", expertise: [], slug: "", showOnAuthors: false,
  twitter: "", github: "", linkedin: "", youtube: "", twitch: "",
  theme: "system", timezone: "UTC+08:00", language: "English",
  notifyComments: false, notifyUsers: false, notifyDigest: false,
  twoFactorEnabled: false,
}

const tabs = [
  { key: "profile", label: "Profile", icon: "user" },
  { key: "social", label: "Social", icon: "link" },
  { key: "preferences", label: "Preferences", icon: "gear" },
  { key: "security", label: "Security", icon: "shield" },
] as const

type TabKey = (typeof tabs)[number]["key"]

export default function AdminProfile() {
  const { store, updateUser, addActivity } = useAdminStore()
  const session = getSession()
  const currentUser = store.users.find((u) => u.email === session?.email)

  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [activeTab, setActiveTab] = useState<TabKey>("profile")
  const [saved, setSaved] = useState(false)
  const [avatarError, setAvatarError] = useState("")
  const [pwCurrent, setPwCurrent] = useState("")
  const [pwNew, setPwNew] = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [pwMsg, setPwMsg] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const fromUser = (u: typeof currentUser): ProfileForm => ({
    name: u?.name ?? "", bio: u?.bio ?? "", website: u?.website ?? "", avatar: u?.avatar ?? "",
    jobTitle: u?.jobTitle ?? "", expertise: u?.expertise ?? [], slug: u?.slug ?? "",
    showOnAuthors: u?.showOnAuthors ?? false,
    twitter: u?.twitter ?? "", github: u?.github ?? "", linkedin: u?.linkedin ?? "",
    youtube: u?.youtube ?? "", twitch: u?.twitch ?? "",
    theme: u?.theme ?? "system", timezone: u?.timezone ?? "UTC+08:00", language: u?.language ?? "English",
    notifyComments: u?.notifyComments ?? false, notifyUsers: u?.notifyUsers ?? false,
    notifyDigest: u?.notifyDigest ?? false, twoFactorEnabled: u?.twoFactorEnabled ?? false,
  })

  useEffect(() => {
    if (currentUser) setForm(fromUser(currentUser))
  }, [currentUser])

  const hasChanges = currentUser && JSON.stringify(form) !== JSON.stringify(fromUser(currentUser))

  if (!session || !currentUser) return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-page border border-dashed border-line">
          <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
        </div>
        <p className="text-sm text-muted">User not found</p>
      </div>
    </div>
  )

  const handleSave = () => {
    if (!currentUser) return
    updateUser(currentUser.id, form)
    const updated = getSession()
    if (updated) {
      updated.name = form.name
      sessionStorage.setItem("nexora_admin_auth", JSON.stringify(updated))
    }
    addActivity("Updated profile", form.name, session.name)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleAvatarFile = (file: File | undefined) => {
    setAvatarError("")
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setAvatarError("Image must be under 5MB"); return }
    if (!file.type.startsWith("image/")) { setAvatarError("File must be an image"); return }
    const reader = new FileReader()
    reader.onload = (ev) => setForm((f) => ({ ...f, avatar: ev.target?.result as string }))
    reader.readAsDataURL(file)
  }

  const handlePassword = () => {
    if (pwNew !== pwConfirm) { setPwMsg({ text: "Passwords do not match", type: "error" }); return }
    if (pwNew.length < 6) { setPwMsg({ text: "Password must be at least 6 characters", type: "error" }); return }
    const storedPw = currentUser.password || "admin123"
    if (pwCurrent !== storedPw) { setPwMsg({ text: "Current password is incorrect", type: "error" }); return }
    updateUser(currentUser.id, { password: pwNew })
    addActivity("Changed password", form.name, session.name)
    setPwMsg({ text: "Password updated successfully", type: "success" })
    setPwCurrent(""); setPwNew(""); setPwConfirm("")
  }

  const toggleExpertise = (cat: string) => {
    setForm((f) => ({
      ...f,
      expertise: f.expertise.includes(cat) ? f.expertise.filter((c) => c !== cat) : [...f.expertise, cat],
    }))
  }

  const saveDisabled = activeTab === "security" || !hasChanges

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Edit Profile</h1>
          <p className="text-sm text-muted mt-1">Manage your account settings</p>
        </div>
        {hasChanges && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-amber-400 bg-amber-900/15 border border-amber-800/25 px-3 py-1.5 rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
            Unsaved changes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
        <div className="rounded-2xl border border-line bg-card overflow-hidden lg:sticky lg:top-6">
          <div className="p-5 text-center">
            <label className="relative cursor-pointer group inline-block">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-white text-3xl font-bold shadow-sm overflow-hidden ring-2 ring-transparent group-hover:ring-accent/50 transition-all">
                {form.avatar ? (
                  <img src={form.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.slice(0, 2)
                )}
              </div>
              <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleAvatarFile(e.target.files?.[0])} />
            </label>
            <h3 className="text-base font-semibold text-primary mt-3">{currentUser.name}</h3>
            <p className="text-xs text-muted">{currentUser.email}</p>
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {currentUser.roles.map((r: string) => (
                <span key={r} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${roleBadge[r] || "bg-filter text-muted"}`}>{r}</span>
              ))}
            </div>
          </div>
          <div className="border-t border-line p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2.5 ${
                  activeTab === tab.key ? "bg-accent/10 text-accent" : "text-secondary hover:text-primary hover:bg-page"
                }`}
              >
                {tab.icon === "user" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                ) : tab.icon === "link" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.07a4.5 4.5 0 00-6.364-6.364L4.5 8.688l-1.757 1.757" /></svg>
                ) : tab.icon === "gear" ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ───── Profile Tab ───── */}
        {activeTab === "profile" && (
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-5 border-b border-line">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Personal Information</p>
                  <p className="text-xs text-dim mt-0.5">Update your display name, bio, and author details</p>
                </div>
              </div>

              {avatarError && (
                <div className="text-sm px-4 py-3 rounded-xl bg-red-900/20 text-red-400 border border-red-800/30 flex items-center gap-2.5">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  {avatarError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Display Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Job Title</label>
                  <input type="text" value={form.jobTitle} onChange={(e) => setForm((f) => ({ ...f, jobTitle: e.target.value }))}
                    placeholder="e.g. Senior Editor"
                    className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Website</label>
                  <input type="url" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                    placeholder="https://yoursite.com"
                    className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Custom Slug</label>
                  <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    placeholder="e.g. john-doe"
                    className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Avatar URL</label>
                <input type="text" value={form.avatar} onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
                  placeholder="Or paste image URL..."
                  className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition resize-none" />
              </div>

              <div className="h-px bg-line" />

              <div>
                <label className="block text-sm font-medium text-secondary mb-3">Expertise Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => {
                    const active = form.expertise.includes(cat)
                    return (
                      <button key={cat} type="button" onClick={() => toggleExpertise(cat)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          active ? "bg-accent/10 border-accent/30 text-accent" : "bg-page border-line text-secondary hover:text-primary"
                        }`}>
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm((f) => ({ ...f, showOnAuthors: !f.showOnAuthors }))}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.showOnAuthors ? "bg-accent" : "bg-filter"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.showOnAuthors ? "translate-x-5" : "translate-x-0"}`} />
                </button>
                <div>
                  <p className="text-sm font-medium text-primary">Show on Authors Page</p>
                  <p className="text-xs text-dim">Display your profile on the public authors listing</p>
                </div>
              </div>
            </div>

            <div className="px-6 lg:px-8 py-4 bg-page border-t border-line flex items-center gap-4">
              <button onClick={handleSave} disabled={saveDisabled}
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
                <span className="text-xs text-amber-400 lg:hidden flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  Unsaved
                </span>
              )}
            </div>
          </div>
        )}

        {/* ───── Social Tab ───── */}
        {activeTab === "social" && (
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-5 border-b border-line">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.07a4.5 4.5 0 00-6.364-6.364L4.5 8.688l-1.757 1.757" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Social Links</p>
                  <p className="text-xs text-dim mt-0.5">Connect your social media profiles</p>
                </div>
              </div>

              {([
                { key: "twitter", label: "Twitter / X", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", placeholder: "https://x.com/username" },
                { key: "github", label: "GitHub", icon: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", placeholder: "https://github.com/username" },
                { key: "linkedin", label: "LinkedIn", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", placeholder: "https://linkedin.com/in/username" },
                { key: "youtube", label: "YouTube", icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", placeholder: "https://youtube.com/@channel" },
                { key: "twitch", label: "Twitch", icon: "M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z", placeholder: "https://twitch.tv/username" },
              ] as const).map(({ key, label, icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-secondary mb-1.5">{label}</label>
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                      <path d={icon} />
                    </svg>
                    <input type="url" value={(form as any)[key] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full bg-page border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition" />
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 lg:px-8 py-4 bg-page border-t border-line flex items-center gap-4">
              <button onClick={handleSave} disabled={saveDisabled}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100">
                Save Changes
              </button>
              {saved && (
                <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Saved!
                </span>
              )}
            </div>
          </div>
        )}

        {/* ───── Preferences Tab ───── */}
        {activeTab === "preferences" && (
          <div className="rounded-2xl border border-line bg-card overflow-hidden">
            <div className="p-6 lg:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-5 border-b border-line">
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Preferences</p>
                  <p className="text-xs text-dim mt-0.5">Customize your admin experience</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Admin Theme</label>
                <div className="flex gap-2">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, theme: t }))}
                      className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                        form.theme === t ? "bg-accent/10 border-accent/30 text-accent" : "bg-page border-line text-secondary hover:text-primary"
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Timezone</label>
                  <select value={form.timezone} onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
                    className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition appearance-none">
                    {timezoneOptions.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Language</label>
                  <select value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                    className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition appearance-none">
                    {languageOptions.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="h-px bg-line" />

              <div>
                <p className="text-sm font-medium text-primary mb-4">Notification Preferences</p>
                <div className="space-y-4">
                  {([
                    { key: "notifyComments", label: "New Comments", desc: "Get notified when someone comments on a post" },
                    { key: "notifyUsers", label: "New Users", desc: "Get notified when a new user registers" },
                    { key: "notifyDigest", label: "Weekly Digest", desc: "Receive a weekly summary of site activity" },
                  ] as const).map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center gap-3">
                      <button type="button" onClick={() => setForm((f) => ({ ...f, [key]: !(f as any)[key] }))}
                        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${(form as any)[key] ? "bg-accent" : "bg-filter"}`}>
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${(form as any)[key] ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                      <div>
                        <p className="text-sm font-medium text-primary">{label}</p>
                        <p className="text-xs text-dim">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 lg:px-8 py-4 bg-page border-t border-line flex items-center gap-4">
              <button onClick={handleSave} disabled={saveDisabled}
                className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100">
                Save Changes
              </button>
              {saved && (
                <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Saved!
                </span>
              )}
            </div>
          </div>
        )}

        {/* ───── Security Tab ───── */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-line bg-card overflow-hidden">
              <div className="p-6 lg:p-8 space-y-5">
                <div className="flex items-center gap-3 pb-5 border-b border-line">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Change Password</p>
                    <p className="text-xs text-dim mt-0.5">Update your account password</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Current Password</label>
                  <input type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)}
                    className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    placeholder="Enter current password" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">New Password</label>
                    <input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)}
                      className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                      placeholder="Min. 6 characters" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-1.5">Confirm New Password</label>
                    <input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)}
                      className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                      placeholder="Repeat new password" />
                  </div>
                </div>

                {pwMsg && (
                  <div className={`text-sm px-4 py-3 rounded-xl flex items-center gap-2.5 ${
                    pwMsg.type === "success" ? "bg-emerald-900/20 text-emerald-400 border border-emerald-800/30" : "bg-red-900/20 text-red-400 border border-red-800/30"
                  }`}>
                    {pwMsg.type === "success" ? (
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    ) : (
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    )}
                    {pwMsg.text}
                  </div>
                )}
              </div>

              <div className="px-6 lg:px-8 py-4 bg-page border-t border-line">
                <button onClick={handlePassword}
                  className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20 active:scale-[0.98]">
                  Update Password
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-card overflow-hidden">
              <div className="p-6 lg:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-5 border-b border-line">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-primary">Account Security</p>
                    <p className="text-xs text-dim mt-0.5">Security settings and recent activity</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-page border border-line">
                  <div>
                    <p className="text-sm font-medium text-primary">Last Login</p>
                    <p className="text-xs text-dim mt-0.5">
                      {currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleString() : "Not recorded yet"}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                </div>

                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, twoFactorEnabled: !f.twoFactorEnabled }))}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${form.twoFactorEnabled ? "bg-accent" : "bg-filter"}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.twoFactorEnabled ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                  <div>
                    <p className="text-sm font-medium text-primary">Two-Factor Authentication</p>
                    <p className="text-xs text-dim">Add an extra layer of security to your account</p>
                  </div>
                </div>

                {hasChanges && (
                  <div className="flex items-center gap-3 pt-2">
                    <button onClick={handleSave}
                      className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20 active:scale-[0.98]">
                      Save Security Settings
                    </button>
                    {saved && (
                      <span className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Saved!
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
