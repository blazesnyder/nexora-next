"use client"

import { useCallback, useSyncExternalStore } from "react"
import {
  AdminPost,
  AdminUserEntry,
  MediaItem,
  SiteSettings,
  ActivityEntry,
  CommentEntry,
  ContactEntry,
  AnalyticsEntry,
  SEED_POSTS,
  DEFAULT_SETTINGS,
  DEFAULT_USERS,
  STORE_VERSION,
  addIdsToBlocks,
} from "./types"
import seedBlocks from "./seed-blocks.json"

type StoreShape = {
  posts: AdminPost[]
  users: AdminUserEntry[]
  media: MediaItem[]
  settings: SiteSettings
  activity: ActivityEntry[]
  comments: CommentEntry[]
  contacts: ContactEntry[]
  analytics: AnalyticsEntry[]
}

const STORAGE_KEY = "nexora_admin_store"

function getStore(): StoreShape {
  if (typeof window === "undefined") {
    return { posts: SEED_POSTS, users: DEFAULT_USERS, media: [], settings: DEFAULT_SETTINGS, activity: [], comments: [], contacts: [], analytics: [] }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreShape> & { version?: string }
      if (parsed.version !== STORE_VERSION) {
        localStorage.removeItem(STORAGE_KEY)
        const defaults: StoreShape = { posts: SEED_POSTS, users: DEFAULT_USERS, media: [], settings: DEFAULT_SETTINGS, activity: [], comments: [], contacts: [], analytics: [] }
        saveStore(defaults)
        return defaults
      }
      return {
        posts: parsed.posts ?? [],
        users: parsed.users ?? DEFAULT_USERS,
        media: parsed.media ?? [],
        settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
        activity: parsed.activity ?? [],
        comments: parsed.comments ?? [],
        contacts: parsed.contacts ?? [],
        analytics: parsed.analytics ?? [],
      }
    }
  } catch { /* ignore */ }
  const defaults: StoreShape = { posts: SEED_POSTS, users: DEFAULT_USERS, media: [], settings: DEFAULT_SETTINGS, activity: [], comments: [], contacts: [], analytics: [] }
  saveStore(defaults)
  return defaults
}

function saveStore(shape: StoreShape) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...shape, version: STORE_VERSION }))
  } catch { /* ignore */ }
  // Sync published posts to server
  if (typeof window !== "undefined") {
    try {
      const published = shape.posts.filter((p) => p.status === "Published")
      fetch("/api/posts/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts: published }),
      }).catch(() => {})
    } catch { /* ignore */ }
  }
}

const listeners = new Set<() => void>()

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function emit() {
  listeners.forEach((cb) => cb())
}

let cachedSnapshot: StoreShape | null = null
let cachedRaw: string | null = null

let serverSnapshotCache: StoreShape | null = null

function getServerSnapshot(): StoreShape {
  if (serverSnapshotCache) return serverSnapshotCache
  if (typeof window === "undefined") {
    serverSnapshotCache = { posts: SEED_POSTS, users: DEFAULT_USERS, media: [], settings: DEFAULT_SETTINGS, activity: [], comments: [], contacts: [], analytics: [] }
    return serverSnapshotCache
  }
  // On client, return the initial server snapshot (not getStore())
  if (!serverSnapshotCache) {
    serverSnapshotCache = { posts: SEED_POSTS, users: DEFAULT_USERS, media: [], settings: DEFAULT_SETTINGS, activity: [], comments: [], contacts: [], analytics: [] }
  }
  return serverSnapshotCache
}

function snapshot(): StoreShape {
  const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
  if (raw === cachedRaw && cachedSnapshot) return cachedSnapshot
  cachedRaw = raw
  cachedSnapshot = getStore()
  return cachedSnapshot
}

export function usePosts() {
  return useSyncExternalStore(subscribe, () => snapshot().posts, () => getServerSnapshot().posts)
}

export function useSettings() {
  return useSyncExternalStore(subscribe, () => snapshot().settings, () => getServerSnapshot().settings)
}

export function useUsers() {
  return useSyncExternalStore(subscribe, () => snapshot().users, () => getServerSnapshot().users)
}

export function useMedia() {
  return useSyncExternalStore(subscribe, () => snapshot().media, () => getServerSnapshot().media)
}

export function useActivity() {
  return useSyncExternalStore(subscribe, () => snapshot().activity, () => getServerSnapshot().activity)
}

export function useComments() {
  return useSyncExternalStore(subscribe, () => snapshot().comments, () => getServerSnapshot().comments)
}

export function useContacts() {
  return useSyncExternalStore(subscribe, () => snapshot().contacts, () => getServerSnapshot().contacts)
}

export function useAnalytics() {
  return useSyncExternalStore(subscribe, () => snapshot().analytics, () => getServerSnapshot().analytics)
}

export function useAdminStore() {
  const emitChange = useCallback(() => emit(), [])
  const posts = usePosts()
  const users = useUsers()
  const settings = useSettings()
  const media = useMedia()
  const contacts = useContacts()
  const analytics = useAnalytics()
  const activity = useActivity()

  const setPosts = useCallback(
    (posts: AdminPost[]) => {
      const store = getStore()
      store.posts = posts
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const addPost = useCallback(
    (post: {
      slug: string
      title: string
      category: "AI" | "Gaming" | "Esports" | "Tech"
      status: "Draft" | "Published"
      blocks: unknown[]
      excerpt?: string
      featuredImage?: string
      authorEmail?: string
      id?: string
      createdAt?: string
      updatedAt?: string
    }) => {
      const store = getStore()
      const now = new Date().toISOString()
      const newPost: AdminPost = {
        id: post.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        slug: post.slug,
        title: post.title,
        category: post.category,
        status: post.status,
        blocks: post.blocks,
        excerpt: post.excerpt ?? "",
        featuredImage: post.featuredImage ?? "",
        authorEmail: post.authorEmail,
        createdAt: post.createdAt ?? now,
        updatedAt: post.updatedAt ?? now,
      }
      store.posts = [newPost, ...store.posts]
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const updatePost = useCallback(
    (slug: string, updates: Partial<AdminPost>) => {
      const store = getStore()
      const idx = store.posts.findIndex((p) => p.slug === slug)
      if (idx !== -1) {
        store.posts[idx] = { ...store.posts[idx], ...updates }
        saveStore(store)
        emitChange()
      }
    },
    [emitChange]
  )

  const deletePost = useCallback(
    (slug: string) => {
      const store = getStore()
      store.posts = store.posts.filter((p) => p.slug !== slug)
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const createPost = addPost

  const setSettings = useCallback(
    (settings: Partial<SiteSettings>) => {
      const store = getStore()
      store.settings = { ...store.settings, ...settings }
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const updateSettings = useCallback(
    (settings: Partial<SiteSettings>) => {
      const store = getStore()
      store.settings = { ...store.settings, ...settings }
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const clearActivity = useCallback(
    () => {
      const store = getStore()
      store.activity = []
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const resetData = useCallback(
    () => {
      const defaults: StoreShape = { posts: SEED_POSTS, users: DEFAULT_USERS, media: [], settings: DEFAULT_SETTINGS, activity: [], comments: [], contacts: [], analytics: [] }
      saveStore(defaults)
      emitChange()
    },
    [emitChange]
  )

  const addMedia = useCallback(
    (item: Omit<MediaItem, "id" | "uploadedAt">) => {
      const store = getStore()
      const mediaItem: MediaItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        uploadedAt: new Date().toISOString(),
      }
      store.media = [mediaItem, ...store.media]
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const deleteMedia = useCallback(
    (id: string) => {
      const store = getStore()
      store.media = store.media.filter((m) => m.id !== id)
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const addActivity = useCallback(
    (action: string, detail: string, user: string) => {
      const store = getStore()
      store.activity = [
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, action, detail, user, timestamp: new Date().toISOString() },
        ...store.activity,
      ]
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const updateUser = useCallback(
    (id: string, updates: Partial<AdminUserEntry>) => {
      const store = getStore()
      const idx = store.users.findIndex((u) => u.id === id)
      if (idx !== -1) {
        store.users[idx] = { ...store.users[idx], ...updates }
        saveStore(store)
        emitChange()
      }
    },
    [emitChange]
  )

  const createUser = useCallback(
    (user: Partial<AdminUserEntry> & { email: string; name: string; roles: string[] }) => {
      const store = getStore()
      const newUser: AdminUserEntry = {
        id: user.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        email: user.email,
        name: user.name,
        roles: user.roles,
        createdAt: user.createdAt ?? new Date().toISOString(),
        avatar: user.avatar,
        bio: user.bio,
        website: user.website,
        password: user.password,
        jobTitle: user.jobTitle,
        expertise: user.expertise,
        slug: user.slug,
        showOnAuthors: user.showOnAuthors,
        twitter: user.twitter,
        github: user.github,
        linkedin: user.linkedin,
        youtube: user.youtube,
        twitch: user.twitch,
        theme: user.theme,
        timezone: user.timezone,
        language: user.language,
        notifyComments: user.notifyComments,
        notifyUsers: user.notifyUsers,
        notifyDigest: user.notifyDigest,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLogin: user.lastLogin,
      }
      store.users = [newUser, ...store.users]
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const deleteUser = useCallback(
    (id: string) => {
      const store = getStore()
      store.users = store.users.filter((u) => u.id !== id)
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const addContact = useCallback(
    (contact: Partial<ContactEntry> & { name: string; email: string; subject: string; message: string }) => {
      const store = getStore()
      const newContact: ContactEntry = {
        id: contact.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.createdAt ?? new Date().toISOString(),
        read: contact.read ?? false,
      }
      store.contacts = [newContact, ...store.contacts]
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const markContactRead = useCallback(
    (id: string) => {
      const store = getStore()
      const contact = store.contacts.find((c) => c.id === id)
      if (contact) {
        contact.read = true
        saveStore(store)
        emitChange()
      }
    },
    [emitChange]
  )

  const deleteContact = useCallback(
    (id: string) => {
      const store = getStore()
      store.contacts = store.contacts.filter((c) => c.id !== id)
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const addAnalytics = useCallback(
    (entry: AnalyticsEntry) => {
      const store = getStore()
      store.analytics = [entry, ...store.analytics]
      saveStore(store)
      emitChange()
    },
    [emitChange]
  )

  const trackView = useCallback(
    (page: string, postSlug?: string) => {
      const store = getStore()
      store.analytics = [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          page,
          postSlug,
          referrer: document.referrer,
          timestamp: new Date().toISOString(),
        },
        ...store.analytics,
      ]
      saveStore(store)
    },
    []
  )

  return {
    store: {
      posts,
      users,
      settings,
      media,
      contacts,
      analytics,
      activity,
    },
    posts,
    users,
    settings,
    media,
    contacts,
    analytics,
    activity,
    setPosts,
    addPost,
    createPost,
    updatePost,
    deletePost,
    setSettings,
    updateSettings,
    clearActivity,
    resetData,
    addMedia,
    deleteMedia,
    addActivity,
    addContact,
    markContactRead,
    deleteContact,
    updateUser,
    createUser,
    deleteUser,
    addAnalytics,
    trackView,
  }
}

const trackViewServer = (page: string, postSlug?: string) => {
  if (typeof window !== "undefined") {
    // handled by trackView in useAdminStore
  }
}

export function useTrackView(): (page: string, postSlug?: string) => void {
  return useAdminStore().trackView
}

export type {
  AdminPost,
  AdminUserEntry,
  MediaItem,
  SiteSettings,
  ActivityEntry,
  CommentEntry,
  ContactEntry,
  AnalyticsEntry,
} from "./types"

export {
  SEED_POSTS,
  DEFAULT_SETTINGS,
  DEFAULT_USERS,
  STORE_VERSION,
  addIdsToBlocks,
} from "./types"