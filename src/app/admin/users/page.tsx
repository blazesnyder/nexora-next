"use client"

import { useState, useCallback } from "react"
import { useAdminStore, type AdminUserEntry } from "@/lib/admin-store"

const roleColors: Record<string, string> = {
  "Full Access": "bg-violet-900/30 text-violet-400",
  Admin: "bg-violet-900/30 text-violet-400",
  Editor: "bg-blue-900/30 text-blue-400",
  Author: "bg-emerald-900/30 text-emerald-400",
}

const allRoles = ["Full Access", "Editor", "Author"]

type UserForm = { name: string; email: string; roles: string[] }
const emptyForm: UserForm = { name: "", email: "", roles: ["Author"] }

export default function AdminUsers() {
  const { store, createUser, updateUser, deleteUser, addActivity } = useAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<UserForm>(emptyForm)
  const [search, setSearch] = useState("")
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)
  const [formError, setFormError] = useState("")

  const currentName = typeof window !== "undefined"
    ? JSON.parse(sessionStorage.getItem("nexora_admin_auth") || "{}").name || "Admin"
    : "Admin"

  const filtered = store.users.filter(
    (u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  )

  const toggleRole = useCallback((r: string) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(r) ? prev.roles.filter((x) => x !== r) : [...prev.roles, r],
    }))
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    if (!form.roles.length) return
    if (editingId) {
      updateUser(editingId, form)
      addActivity("Updated user", `${form.name} (${form.email})`, currentName)
    } else {
      if (store.users.some((u) => u.email === form.email)) {
        setFormError("A user with this email already exists.")
        return
      }
      createUser(form)
      addActivity("Created user", `${form.name} (${form.email})`, currentName)
    }
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (u: AdminUserEntry) => {
    setForm({ name: u.name, email: u.email, roles: [...u.roles] })
    setEditingId(u.id)
    setShowForm(true)
  }

  const handleDelete = () => {
    if (!confirmDelete) return
    deleteUser(confirmDelete.id)
    addActivity("Deleted user", confirmDelete.name, currentName)
    setConfirmDelete(null)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Users</h1>
          <p className="text-sm text-muted mt-1">{store.users.length} user{(store.users.length !== 1) && "s"} registered</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add User
        </button>
      </div>

      <div className="relative max-w-xs">
        <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full bg-card border border-line rounded-xl pl-10 pr-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-md bg-card border border-line rounded-2xl p-6 shadow-2xl shadow-black/20 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-4 mb-5 border-b border-line">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125A3.375 3.375 0 114.5 9.75m3.75 0a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">{editingId ? "Edit User" : "Add User"}</h2>
                <p className="text-xs text-dim mt-0.5">{editingId ? "Update user details and roles" : "Create a new admin user"}</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                  placeholder="John Doe" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-sm text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                  placeholder="john@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5">Roles <span className="text-dim font-normal">(select one or more)</span></label>
                <div className="flex flex-wrap gap-2">
                  {allRoles.map((r) => {
                    const selected = form.roles.includes(r)
                    return (
                      <button key={r} type="button" onClick={() => toggleRole(r)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                          selected
                            ? `${roleColors[r]} border-transparent shadow-sm`
                            : "text-secondary border-line hover:text-primary hover:border-line-hover"
                        }`}
                      >
                        {selected && <span className="mr-1.5">✓</span>}
                        {r}
                      </button>
                    )
                  })}
                </div>
                {form.roles.length === 0 && <p className="text-xs text-red-400 mt-1">Select at least one role</p>}
              </div>
              <p className="text-xs text-dim">Default password: <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded">password123</code></p>
              {formError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-900/20 border border-red-800/30 px-4 py-3">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <p className="text-sm text-red-400">{formError}</p>
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-sm text-secondary hover:text-primary border border-line hover:bg-card-alt transition">Cancel</button>
                <button type="submit" disabled={!form.roles.length}
                  className="px-5 py-2 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition disabled:opacity-50 shadow-sm">{editingId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm bg-card border border-line rounded-2xl p-6 shadow-2xl shadow-black/20 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-line">
              <div className="w-9 h-9 rounded-xl bg-red-900/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Delete User</h2>
                <p className="text-xs text-dim mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-secondary mb-1">Are you sure you want to delete <span className="font-semibold text-primary">{confirmDelete.name}</span>?</p>
            <p className="text-xs text-dim mb-5">All associated data will be permanently removed.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-xl text-sm text-secondary hover:text-primary border border-line hover:bg-card-alt transition">Cancel</button>
              <button onClick={handleDelete}
                className="px-5 py-2 rounded-xl text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition shadow-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-page/50">
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider">Roles</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Created</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-page border border-dashed border-line">
                    <svg className="w-7 h-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  </div>
                  <p className="text-sm text-muted">{search ? "No users match your search." : "No users yet."}</p>
                  <p className="text-xs text-dim mt-1">{search ? "Try a different search term" : "Click 'Add User' to get started."}</p>
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-card-alt transition-colors duration-150 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-violet-500 flex items-center justify-center text-white text-xs font-bold uppercase flex-shrink-0 shadow-sm">
                        {u.name.slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium text-primary">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{u.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {u.roles.map((r: string) => (
                        <span key={r} className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${roleColors[r] || "bg-filter text-muted"}`}>{r}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted hidden md:table-cell">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button onClick={() => handleEdit(u)} className="p-2 text-muted hover:text-primary hover:bg-card rounded-lg transition" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      </button>
                      <button onClick={() => setConfirmDelete({ id: u.id, name: u.name })} className="p-2 text-muted hover:text-red-400 hover:bg-red-900/10 rounded-lg transition" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
