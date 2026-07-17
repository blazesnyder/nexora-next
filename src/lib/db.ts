import fs from "fs"
import path from "path"
import type { AdminPost, AdminUserEntry, SiteSettings } from "./types"

const DATA_DIR = path.join(process.cwd(), "src", "data")
const DB_FILE = path.join(DATA_DIR, "store.json")

type StoreShape = {
  posts: AdminPost[]
  users: AdminUserEntry[]
  settings: SiteSettings
}

function readDb(): StoreShape {
  try {
    if (!fs.existsSync(DB_FILE)) {
      return { posts: [], users: [], settings: { siteName: "Nexora", siteDescription: "AI, Gaming, Esports & Tech", postsPerPage: 9, enableComments: false } }
    }
    const raw = fs.readFileSync(DB_FILE, "utf-8")
    return JSON.parse(raw)
  } catch {
    return { posts: [], users: [], settings: { siteName: "Nexora", siteDescription: "AI, Gaming, Esports & Tech", postsPerPage: 9, enableComments: false } }
  }
}

function writeDb(shape: StoreShape) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DB_FILE, JSON.stringify(shape, null, 2), "utf-8")
}

export function getPublishedPosts(): AdminPost[] {
  const db = readDb()
  return db.posts.filter((p) => p.status === "Published")
}

export function getPostBySlug(slug: string): AdminPost | null {
  const db = readDb()
  return db.posts.find((p) => p.slug === slug && p.status === "Published") || null
}

export function getAllPosts(): AdminPost[] {
  const db = readDb()
  return db.posts
}

export function createPost(post: AdminPost): AdminPost {
  const db = readDb()
  db.posts.push(post)
  writeDb(db)
  return post
}

export function updatePost(slug: string, updates: Partial<AdminPost>): AdminPost | null {
  const db = readDb()
  const idx = db.posts.findIndex((p) => p.slug === slug)
  if (idx === -1) return null
  db.posts[idx] = { ...db.posts[idx], ...updates }
  writeDb(db)
  return db.posts[idx]
}

export function deletePost(slug: string): boolean {
  const db = readDb()
  const len = db.posts.length
  db.posts = db.posts.filter((p) => p.slug !== slug)
  if (db.posts.length === len) return false
  writeDb(db)
  return true
}

export function getSettings(): SiteSettings {
  const db = readDb()
  return db.settings
}

export function updateSettings(settings: Partial<SiteSettings>): SiteSettings {
  const db = readDb()
  db.settings = { ...db.settings, ...settings }
  writeDb(db)
  return db.settings
}

export function getUsers(): AdminUserEntry[] {
  const db = readDb()
  return db.users
}

export function seedInitialData(posts: AdminPost[]) {
  const db = readDb()
  if (db.posts.length === 0) {
    db.posts = posts
    writeDb(db)
  }
}