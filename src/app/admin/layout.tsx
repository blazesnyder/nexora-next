"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { isAuthenticated, getSession, logout, hasPermission } from "@/lib/admin-auth"

type NavItem = { href: string; label: string; icon: React.ReactNode; minRole: "admin" | "editor" | "author" }

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", minRole: "author", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
  { href: "/admin/posts", label: "Posts", minRole: "author", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
  { href: "/admin/categories", label: "Categories", minRole: "editor", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg> },
  { href: "/admin/users", label: "Users", minRole: "admin", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg> },
  { href: "/admin/media", label: "Media", minRole: "editor", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg> },
  { href: "/admin/contacts", label: "Contacts", minRole: "editor", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg> },
  { href: "/admin/analytics", label: "Analytics", minRole: "admin", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 012.25-2.25h9.5A2.25 2.25 0 0121.75 3v1.5m0 0v1.5M3.75 3h1.5m16.5 0h-1.5M12 3v1.5m0 0v1.5" /></svg> },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthed(true)
      return
    }
    if (!isAuthenticated()) {
      router.replace("/admin/login")
      return
    }
    const routePermissions: Record<string, "admin" | "editor" | "author"> = {
      "/admin/users": "admin",
      "/admin/settings": "admin",
      "/admin/media": "editor",
      "/admin/categories": "editor",
      "/admin/posts": "author",
      "/admin/posts/new": "author",
      "/admin/analytics": "admin",
      "/admin/contacts": "admin",
    }
    const needed = Object.entries(routePermissions).find(([route]) => pathname === route || pathname.startsWith(route + "/"))
    if (needed && !hasPermission(needed[1])) {
      router.replace("/admin")
      return
    }
    setAuthed(true)
  }, [pathname, router])

  const pageTitle = navItems.find((i) => i.href === pathname || (i.href !== "/admin" && pathname.startsWith(i.href) && i.href !== "/admin/posts"))?.label
    || navItems.find((i) => i.href === "/admin/posts" && pathname.startsWith("/admin/posts"))?.label || "Admin"

  if (!authed) return (
    <div className="flex min-h-screen items-center justify-center bg-page">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-xs text-dim">Authenticating...</p>
      </div>
    </div>
  )

  if (pathname === "/admin/login") return <>{children}</>

  const user = getSession()
  const initials = user?.name?.slice(0, 2)?.toUpperCase() || "AD"

  return (
    <div className="flex h-screen bg-page text-primary overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed md:sticky top-0 left-0 z-50 w-64 bg-card border-r border-line h-screen flex-shrink-0 flex flex-col transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="p-5 border-b border-line">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-xl font-bold text-primary tracking-tight flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-accent/10">N</span>
                Nexora
              </Link>
              <p className="text-[10px] text-dim mt-1.5 ml-[42px] tracking-wide">Admin Panel</p>
            </div>
            <button className="md:hidden text-muted hover:text-primary transition-colors" onClick={() => setMobileOpen(false)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          <p className="px-3 py-2 text-[10px] font-semibold text-dim uppercase tracking-[0.15em]">Menu</p>
          {navItems.filter((item) => hasPermission(item.minRole)).map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-accent/10 text-accent font-semibold"
                    : "text-secondary hover:text-primary hover:bg-card-alt"
                }`}
              >
                <span className={`flex-shrink-0 transition-colors duration-200 ${isActive ? "text-accent" : "text-muted group-hover:text-primary"}`}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
              </Link>
            )
          })}
        </nav>

        {user && (
          <div className="relative shrink-0 p-3 border-t border-line" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full rounded-xl bg-page hover:bg-card-alt transition-colors text-left group"
            >
              <div className="flex items-center gap-3 p-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-white text-xs font-bold uppercase flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-primary truncate">{user.name}</p>
                  <p className="text-[11px] text-dim truncate">{user.email}</p>
                </div>
                <svg className={`w-4 h-4 text-muted transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-1.5 rounded-xl border border-line bg-card shadow-xl shadow-black/10 overflow-hidden origin-bottom animate-fade-in">
                <div className="px-4 py-3 border-b border-line">
                  <p className="text-xs font-medium text-primary truncate">{user.name}</p>
                  <p className="text-[10px] text-dim truncate mt-0.5">{user.email}</p>
                </div>
                <Link
                  href="/admin/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-card-alt transition text-left"
                >
                  <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                  Edit Profile
                </Link>
                {hasPermission("admin") && (
                  <>
                    <div className="border-t border-line" />
                    <Link
                      href="/admin/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-card-alt transition text-left"
                    >
                      <svg className="w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Settings
                    </Link>
                  </>
                )}
                <div className="border-t border-line" />
                <button
                  onClick={() => { logout(); router.push("/admin/login") }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-accent hover:bg-accent/5 transition text-left"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-14 bg-card/80 backdrop-blur-md border-b border-line flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden text-secondary hover:text-primary transition-colors" onClick={() => setMobileOpen(true)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
            </button>
            <div className="flex items-center gap-2.5 min-w-0">
              <h2 className="text-sm font-semibold text-primary truncate">{pageTitle}</h2>
              <span className="hidden md:inline text-xs text-dim whitespace-nowrap">/ {pathname.split("/").filter(Boolean).join(" / ")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-primary hover:bg-card-alt border border-line transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              View Site
            </Link>
            {user && (
              <div className="flex items-center gap-2 pl-3 border-l border-line">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-alt flex items-center justify-center text-white text-[10px] font-bold uppercase flex-shrink-0 shadow-sm">
                  {initials}
                </div>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-y-auto min-h-0">{children}</main>
      </div>
    </div>
  )
}
