const AUTH_KEY = "nexora_admin_auth"

const DEFAULT_CREDENTIALS = {
  email: "admin@nexora.com",
  password: "admin123",
}

export type AdminUser = {
  email: string
  name: string
  roles: string[]
}

function getStore() {
  try {
    const raw = localStorage.getItem("nexora_admin_store")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function getStoredRoles(email: string): string[] {
  const store = getStore()
  if (!store?.users) return []
  const found = store.users.find((u: { email: string; roles?: string[] }) => u.email === email)
  return found?.roles ?? []
}

export function login(email: string, password: string): AdminUser | null {
  const store = getStore()

  if (email === DEFAULT_CREDENTIALS.email && password === DEFAULT_CREDENTIALS.password) {
    let roles = getStoredRoles(email)
    if (roles.length === 0) roles = ["Full Access", "Editor", "Author"]
    const user: AdminUser = { email, name: "Admin", roles }
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return user
  }

  if (store?.users) {
    const found = store.users.find((u: { email: string; name: string; roles?: string[]; password?: string }) => u.email === email)
    const expectedPw = found?.password || "password123"
    if (found && password === expectedPw) {
      const user: AdminUser = { email: found.email, name: found.name, roles: found.roles ?? [] }
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(user))
      return user
    }
  }

  return null
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY)
}

export function getSession(): AdminUser | null {
  if (typeof window === "undefined") return null
  try {
    const data = sessionStorage.getItem(AUTH_KEY)
    if (!data) return null
    const parsed = JSON.parse(data)
    if (parsed.role && !parsed.roles) {
      parsed.roles = [parsed.role]
      delete parsed.role
    }
    const stored = getStoredRoles(parsed.email)
    if (stored.length > 0) {
      parsed.roles = stored
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(parsed))
    }
    return parsed as AdminUser
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

const ROLE_HIERARCHY: Record<string, number> = {
  "Full Access": 3,
  Admin: 3,
  Editor: 2,
  Author: 1,
}

const REQUIRED_LEVEL: Record<string, number> = {
  admin: 3,
  editor: 2,
  author: 1,
}

export function hasPermission(required: string): boolean {
  const user = getSession()
  if (!user?.roles || user.roles.length === 0) return false
  const needed = REQUIRED_LEVEL[required] ?? 0
  if (needed === 0) return false
  return user.roles.some((r: string) => (ROLE_HIERARCHY[r] ?? 0) >= needed)
}
