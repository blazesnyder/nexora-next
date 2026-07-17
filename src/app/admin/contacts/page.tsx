"use client"

import { useState } from "react"
import { useAdminStore } from "@/lib/admin-store"
import { hasPermission } from "@/lib/admin-auth"

export default function ContactsPage() {
  const { store, markContactRead, deleteContact } = useAdminStore()
  const [showing, setShowing] = useState<"all" | "unread">("all")

  const contacts = store.contacts
    .filter((c) => showing === "all" || !c.read)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const unreadCount = store.contacts.filter((c) => !c.read).length

  return (
    <div className="flex h-screen flex-col bg-page">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-line bg-card/80 backdrop-blur px-6">
        <h1 className="text-xl font-bold">Contact Messages</h1>
        <div className="flex items-center gap-3">
          <div className="flex border border-line rounded-lg overflow-hidden">
            <button
              onClick={() => setShowing("all")}
              className={`px-3 py-1.5 text-sm font-medium transition ${showing === "all" ? "bg-accent text-white" : "text-secondary hover:text-primary"}`}
            >
              All ({store.contacts.length})
            </button>
            <button
              onClick={() => setShowing("unread")}
              className={`px-3 py-1.5 text-sm font-medium transition ${showing === "unread" ? "bg-accent text-white" : "text-secondary hover:text-primary"}`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <svg className="w-16 h-16 text-dim mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-secondary">No contact messages found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <article
                key={contact.id}
                className={`p-5 rounded-xl bg-card border transition ${!contact.read ? "border-accent/30 bg-accent/5" : "border-line hover:border-accent/30"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-primary truncate">{contact.name}</h3>
                      <span className="text-sm text-muted truncate">{contact.email}</span>
                      {!contact.read && <span className="badge-accent text-xs">New</span>}
                    </div>
                    <p className="text-sm font-medium text-accent mb-1">{contact.subject}</p>
                    <p className="text-secondary text-sm line-clamp-2">{contact.message}</p>
                    <p className="text-xs text-dim mt-2">{new Date(contact.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!contact.read && hasPermission("admin") && (
                      <button
                        onClick={() => markContactRead(contact.id)}
                        className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                      >
                        Mark Read
                      </button>
                    )}
                    {hasPermission("admin") && (
                      <button
                        onClick={() => {
                          if (confirm("Delete this message?")) deleteContact(contact.id)
                        }}
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}