"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useAdminStore } from "@/lib/admin-store"
import { getSession } from "@/lib/admin-auth"
import ImageUploader from "./ImageUploader"

type BlockType = "heading" | "paragraph" | "image" | "link" | "quote" | "code" | "list" | "divider"

type Block = {
  id: string
  type: BlockType
  data: Record<string, string | string[]>
}

const uid = () => Math.random().toString(36).slice(2, 9)

const emptyBlock = (type: BlockType): Block => {
  const id = uid()
  switch (type) {
    case "heading": return { id, type, data: { level: "h2", text: "" } }
    case "paragraph": return { id, type, data: { text: "" } }
    case "image": return { id, type, data: { src: "", alt: "", caption: "" } }
    case "link": return { id, type, data: { url: "", label: "", newTab: "true" } }
    case "quote": return { id, type, data: { text: "", author: "" } }
    case "code": return { id, type, data: { language: "javascript", code: "" } }
    case "list": return { id, type, data: { style: "bullet", items: [""] } }
    case "divider": return { id, type, data: {} }
  }
}

type ArticleFormat = "standard" | "how-to" | "listicle" | "news" | "tutorial" | "comparison" | "blank"
type EditorMode = "templates" | "quick-article" | "quick-write" | "blocks"

const formats: { id: ArticleFormat; label: string; desc: string; icon: string }[] = [
  { id: "standard", label: "Standard Article", desc: "Title, subtitle, paragraphs — classic blog format", icon: "📝" },
  { id: "how-to", label: "How-To Guide", desc: "Step-by-step instructions with numbered lists", icon: "🔢" },
  { id: "listicle", label: "Listicle", desc: "Intro + numbered/bulleted list items", icon: "📋" },
  { id: "news", label: "News Brief", desc: "Quick summary with key highlights", icon: "📰" },
  { id: "tutorial", label: "Tutorial", desc: "Code blocks with explanations and setup steps", icon: "💻" },
  { id: "comparison", label: "Comparison", desc: "Side-by-side feature breakdown", icon: "⚖️" },
  { id: "blank", label: "Blank Canvas", desc: "Start from scratch with zero blocks", icon: "✨" },
]

function generateTemplate(format: ArticleFormat): { title: string; blocks: Block[] } {
  const b = (type: BlockType) => emptyBlock(type)
  switch (format) {
    case "how-to":
      return {
        title: "How to [Topic]: A Step-by-Step Guide",
        blocks: [
          { ...b("heading"), data: { level: "h2", text: "Introduction" } },
          { ...b("paragraph"), data: { text: "Briefly explain what the reader will learn and why it matters." } },
          { ...b("heading"), data: { level: "h2", text: "Prerequisites" } },
          { ...b("list"), data: { style: "bullet", items: ["Item 1", "Item 2", "Item 3"] } },
          { ...b("divider"), data: {} },
          { ...b("heading"), data: { level: "h2", text: "Step 1: [First Step]" } },
          { ...b("paragraph"), data: { text: "Explain the first step in detail with context." } },
          { ...b("image"), data: { src: "", alt: "Step 1 screenshot", caption: "" } },
          { ...b("heading"), data: { level: "h2", text: "Step 2: [Second Step]" } },
          { ...b("paragraph"), data: { text: "Explain the second step." } },
          { ...b("heading"), data: { level: "h2", text: "Conclusion" } },
          { ...b("paragraph"), data: { text: "Summarize what was accomplished and suggest next steps." } },
        ],
      }
    case "listicle":
      return {
        title: "Top [Number] [Topic] You Need to Know",
        blocks: [
          { ...b("paragraph"), data: { text: "Here's a curated list of the best [topic] this year." } },
          { ...b("heading"), data: { level: "h2", text: "1. [First Item]" } },
          { ...b("paragraph"), data: { text: "Explain why this item made the list." } },
          { ...b("heading"), data: { level: "h2", text: "2. [Second Item]" } },
          { ...b("paragraph"), data: { text: "Details about the second item." } },
          { ...b("heading"), data: { level: "h2", text: "3. [Third Item]" } },
          { ...b("paragraph"), data: { text: "Details about the third item." } },
          { ...b("divider"), data: {} },
          { ...b("paragraph"), data: { text: "Which one is your favorite? Let us know in the comments!" } },
        ],
      }
    case "news":
      return {
        title: "Breaking: [Headline News]",
        blocks: [
          { ...b("paragraph"), data: { text: "In a surprising development today, [company/organization] announced [key news]. Here's everything you need to know." } },
          { ...b("heading"), data: { level: "h2", text: "Key Highlights" } },
          { ...b("list"), data: { style: "bullet", items: ["Highlight 1", "Highlight 2", "Highlight 3"] } },
          { ...b("heading"), data: { level: "h2", text: "What This Means" } },
          { ...b("paragraph"), data: { text: "Industry experts weigh in on the implications." } },
          { ...b("quote"), data: { text: "This is a game-changer for the industry.", author: "[Expert Name], [Title]" } },
        ],
      }
    case "tutorial":
      return {
        title: "Building a [Project] — Complete Tutorial",
        blocks: [
          { ...b("paragraph"), data: { text: "In this tutorial, we'll build a [project] from scratch using [tech stack]." } },
          { ...b("heading"), data: { level: "h2", text: "Prerequisites" } },
          { ...b("list"), data: { style: "bullet", items: ["Node.js 18+", "npm or yarn", "Basic knowledge of [language/framework]"] } },
          { ...b("heading"), data: { level: "h2", text: "Project Setup" } },
          { ...b("code"), data: { language: "bash", code: "# Create project\nmkdir my-project\ncd my-project\nnpm init -y" } },
          { ...b("paragraph"), data: { text: "Let's break down what each command does." } },
          { ...b("heading"), data: { level: "h2", text: "Building the Core Logic" } },
          { ...b("code"), data: { language: "javascript", code: "function main() {\n  console.log('Hello, world!');\n}" } },
          { ...b("paragraph"), data: { text: "This is where the magic happens." } },
          { ...b("heading"), data: { level: "h2", text: "Testing It Out" } },
          { ...b("code"), data: { language: "bash", code: "npm start" } },
        ],
      }
    case "comparison":
      return {
        title: "[Option A] vs [Option B]: Which One Should You Choose?",
        blocks: [
          { ...b("paragraph"), data: { text: "Choosing between [Option A] and [Option B] can be tough." } },
          { ...b("heading"), data: { level: "h2", text: "At a Glance" } },
          { ...b("list"), data: { style: "bullet", items: ["[Option A]: Best for [use case]", "[Option B]: Best for [use case]"] } },
          { ...b("heading"), data: { level: "h2", text: "[Option A] Overview" } },
          { ...b("paragraph"), data: { text: "Detailed breakdown of Option A." } },
          { ...b("heading"), data: { level: "h2", text: "[Option B] Overview" } },
          { ...b("paragraph"), data: { text: "Detailed breakdown of Option B." } },
          { ...b("heading"), data: { level: "h2", text: "Key Differences" } },
          { ...b("list"), data: { style: "bullet", items: ["Feature comparison", "Pricing breakdown"] } },
          { ...b("paragraph"), data: { text: "Verdict: [Recommendation]" } },
        ],
      }
    case "blank":
      return { title: "", blocks: [] }
    default:
      return {
        title: "Article Title",
        blocks: [
          { ...b("paragraph"), data: { text: "Start writing your article here." } },
        ],
      }
  }
}

function markdownToBlocks(md: string): Block[] {
  const lines = md.split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) { i++; continue }

    if (line.startsWith("### ")) {
      blocks.push({ id: uid(), type: "heading", data: { level: "h3", text: line.slice(4) } })
    } else if (line.startsWith("## ")) {
      blocks.push({ id: uid(), type: "heading", data: { level: "h2", text: line.slice(3) } })
    } else if (line.startsWith("# ")) {
      blocks.push({ id: uid(), type: "heading", data: { level: "h1", text: line.slice(2) } })
    } else if (line.startsWith("---") || line.startsWith("***")) {
      blocks.push({ id: uid(), type: "divider", data: {} })
    } else if (line.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2))
        i++
      }
      i--
      blocks.push({ id: uid(), type: "quote", data: { text: quoteLines.join("\n"), author: "" } })
    } else if (line.startsWith("```")) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ id: uid(), type: "code", data: { language: lang || "text", code: codeLines.join("\n") } })
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      const items: string[] = []
      while (i < lines.length && (lines[i].trim().startsWith("- ") || lines[i].trim().startsWith("* "))) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      i--
      blocks.push({ id: uid(), type: "list", data: { style: "bullet", items } })
    } else if (/^\d+[.)] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+[.)] /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)] /, ""))
        i++
      }
      i--
      blocks.push({ id: uid(), type: "list", data: { style: "numbered", items } })
    } else if (/^https?:\/\/\S+/.test(line) && lines[i + 1]?.trim()) {
      blocks.push({ id: uid(), type: "link", data: { url: line, label: lines[i + 1].trim(), newTab: "true" } })
      i++
    } else if (/^https?:\/\/\S+\.(png|jpg|jpeg|gif|webp|svg)/i.test(line)) {
      blocks.push({ id: uid(), type: "image", data: { src: line, alt: "", caption: "" } })
    } else {
      const paraLines: string[] = []
      while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith("#") && !lines[i].trim().startsWith("```") && !lines[i].trim().startsWith(">") && !lines[i].trim().startsWith("- ") && !lines[i].trim().startsWith("* ") && !/^\d+[.)] /.test(lines[i].trim()) && !lines[i].trim().startsWith("---")) {
        paraLines.push(lines[i].trim())
        i++
      }
      i--
      blocks.push({ id: uid(), type: "paragraph", data: { text: paraLines.join(" ") } })
    }

    i++
  }

  return blocks
}

const DRAFT_KEY = "nexora_draft"

function saveDraft(data: unknown) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ data, savedAt: Date.now() })) } catch { }
}

function loadDraft(): { title: string; slug: string; excerpt: string; category: string; status: string; featuredImage: string; blocks: Block[]; format: ArticleFormat | null } | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed.data || null
  } catch { return null }
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY) } catch { }
}

export default function BlockEditor({ editPostId }: { editPostId?: string }) {
  const { store, createPost, updatePost, addActivity } = useAdminStore()
  const [mode, setMode] = useState<EditorMode>("templates")
  const [format, setFormat] = useState<ArticleFormat | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [category, setCategory] = useState("AI")
  const [status, setStatus] = useState("Draft")
  const [featuredImage, setFeaturedImage] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([])
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [preview, setPreview] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)

  // Quick Write
  const [quickWriteText, setQuickWriteText] = useState("")

  // Quick Article
  const [quickContent, setQuickContent] = useState("")

  // Inline editing
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const editRef = useRef<HTMLTextAreaElement | null>(null)

  // Check for existing draft on mount
  useEffect(() => {
    if (editPostId) {
      const existing = store.posts.find((p) => p.id === editPostId)
      if (existing) {
        setTitle(existing.title)
        setSlug(existing.slug)
        setExcerpt(existing.excerpt || "")
        setCategory(existing.category)
        setStatus(existing.status)
        setFeaturedImage(existing.featuredImage || "")
        setBlocks(existing.blocks as Block[])
        setFormat(null)
        setMode("blocks")
      }
      return
    }
    const draft = loadDraft()
    if (draft && draft.blocks && draft.blocks.length > 0) {
      setHasDraft(true)
    }
  }, [editPostId, store.posts])

  const restoreDraft = useCallback(() => {
    const draft = loadDraft()
    if (draft) {
      setTitle(draft.title)
      setSlug(draft.slug)
      setExcerpt(draft.excerpt)
      setCategory(draft.category)
      setStatus(draft.status)
      setFeaturedImage(draft.featuredImage)
      setBlocks(draft.blocks)
      setFormat(draft.format)
      setHasDraft(false)
      if (draft.format) setMode("blocks")
    }
  }, [])

  const discardDraft = useCallback(() => {
    clearDraft()
    setHasDraft(false)
  }, [])

  // Auto-save effect
  useEffect(() => {
    if (editPostId) return
    if (blocks.length > 0 || title) {
      const timer = setTimeout(() => {
        saveDraft({ title, slug, excerpt, category, status, featuredImage, blocks, format })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [title, slug, excerpt, category, status, featuredImage, blocks, format])

  // Focus edit ref when inline editing starts
  useEffect(() => {
    if (editingBlockId && editRef.current) {
      editRef.current.focus()
      editRef.current.setSelectionRange(editRef.current.value.length, editRef.current.value.length)
    }
  }, [editingBlockId])

  const pickFormat = useCallback((f: ArticleFormat) => {
    const template = generateTemplate(f)
    setFormat(f)
    setTitle(template.title)
    setSlug(template.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
    setBlocks(template.blocks)
    setMode("blocks")
  }, [])

  const convertQuickWrite = useCallback(() => {
    const converted = markdownToBlocks(quickWriteText)
    if (converted.length > 0) {
      setBlocks(converted)
      if (!title) setTitle("Untitled Article")
      if (!slug) setSlug("untitled-article")
      setMode("blocks")
    }
  }, [quickWriteText, title, slug])

  const mkBlock = (type: BlockType, data: Record<string, string | string[]>): Block => ({ id: uid(), type, data })

  const convertQuickArticle = useCallback(() => {
    const paragraphs = quickContent.split("\n\n").filter((p) => p.trim())
    const converted = paragraphs.reduce<Block[]>((acc, p) => {
      const trimmed = p.trim()
      if (trimmed.startsWith("# ")) acc.push(mkBlock("heading", { level: "h1", text: trimmed.slice(2) }))
      else if (trimmed.startsWith("## ")) acc.push(mkBlock("heading", { level: "h2", text: trimmed.slice(3) }))
      else if (trimmed.startsWith("### ")) acc.push(mkBlock("heading", { level: "h3", text: trimmed.slice(4) }))
      else if (trimmed.startsWith("- ")) acc.push(mkBlock("list", { style: "bullet", items: trimmed.split("\n").map((l) => l.trim().slice(2)).filter(Boolean) }))
      else acc.push(mkBlock("paragraph", { text: trimmed }))
      return acc
    }, [])
    if (converted.length > 0) {
      setBlocks(converted)
      setMode("blocks")
    }
  }, [quickContent])

  const addBlock = useCallback((type: BlockType) => {
    setBlocks((prev) => [...prev, emptyBlock(type)])
  }, [])

  const moveBlock = useCallback((from: number, to: number) => {
    setBlocks((prev) => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  const updateBlock = useCallback((id: string, key: string, value: string | string[]) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, data: { ...b.data, [key]: value } } : b))
    )
  }, [])

  const updateBlockItem = useCallback((id: string, itemIndex: number, value: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b
        const items = [...(b.data.items as string[])]
        items[itemIndex] = value
        return { ...b, data: { ...b.data, items } }
      })
    )
  }, [])

  const addListItem = useCallback((id: string) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b
        return { ...b, data: { ...b.data, items: [...(b.data.items as string[]), ""] } }
      })
    )
  }, [])

  const removeListItem = useCallback((id: string, itemIndex: number) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b
        const items = (b.data.items as string[]).filter((_, i) => i !== itemIndex)
        return { ...b, data: { ...b.data, items } }
      })
    )
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const duplicateBlock = useCallback((block: Block) => {
    const newBlock = { ...block, id: uid() }
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === block.id)
      const next = [...prev]
      next.splice(idx + 1, 0, newBlock)
      return next
    })
  }, [])

  const handleSave = () => {
    const session = getSession()
    const data = { title, slug, excerpt, category: category as "AI" | "Gaming" | "Esports" | "Tech", status: status as "Draft" | "Published", featuredImage, blocks, authorEmail: session?.email }
    if (editPostId) {
      updatePost(editPostId, data)
      addActivity("Updated article", title, session?.name || "Admin")
    } else {
      const id = createPost(data)
      addActivity("Created article", title, session?.name || "Admin")
    }
    clearDraft()
    window.location.href = "/admin/posts"
  }

  const handleDrop = useCallback((e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== toIndex) {
      moveBlock(dragIndex, toIndex)
    }
    setDragIndex(null)
  }, [dragIndex, moveBlock])

  const titleToSlug = useCallback((val: string) => {
    setTitle(val)
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""))
  }, [])

  // Restore draft or show mode selector
  if (hasDraft) {
    return (
      <div className="max-w-lg mx-auto mt-20 text-center">
        <div className="rounded-2xl border border-line bg-card p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-900/30">
            <svg className="h-7 w-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-primary">Unsaved draft found</h2>
          <p className="text-sm text-muted mt-2">You have a draft from a previous session. Would you like to restore it?</p>
          <div className="flex gap-3 mt-6 justify-center">
            <button onClick={restoreDraft} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-accent text-white hover:bg-accent/90 transition">Restore Draft</button>
            <button onClick={discardDraft} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-line text-secondary hover:text-primary hover:bg-card-alt transition">Discard</button>
          </div>
        </div>
      </div>
    )
  }

  // Mode selector (shown when no format is picked and no blocks exist)
  if (mode === "templates" && blocks.length === 0 && !title) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary tracking-tight">New Article</h1>
          <p className="text-sm text-muted mt-1">Choose how you want to create your article</p>
        </div>

        {/* Create mode tabs */}
        <div className="flex gap-1 border border-line rounded-2xl p-1.5 bg-card w-fit">
          <ModeTab active={mode === "templates"} onClick={() => setMode("templates")} icon="📋" label="Templates" />
          <ModeTab active={false} onClick={() => setMode("quick-article")} icon="⚡" label="Quick Article" />
          <ModeTab active={false} onClick={() => setMode("quick-write")} icon="✍️" label="Quick Write" />
        </div>

        {/* Templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => pickFormat(f.id)}
              className="group relative rounded-2xl border border-line bg-card p-6 text-left transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-3xl block mb-4">{f.icon}</span>
              <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">{f.label}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{f.desc}</p>
            </button>
          ))}
        </div>

        {/* Quick write shortcut */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => setMode("quick-article")} className="group relative rounded-2xl border border-line bg-card p-6 text-left transition-all hover:border-accent/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl block mb-3">⚡</span>
            <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">Quick Article</h3>
            <p className="mt-1.5 text-sm text-muted">Just title + content. One textarea, no blocks.</p>
          </button>
          <button onClick={() => setMode("quick-write")} className="group relative rounded-2xl border border-line bg-card p-6 text-left transition-all hover:border-accent/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-2xl block mb-3">✍️</span>
            <h3 className="text-lg font-semibold text-primary group-hover:text-accent transition-colors">Quick Write (Markdown)</h3>
            <p className="mt-1.5 text-sm text-muted">Write in markdown. Auto-converts to blocks.</p>
          </button>
        </div>
      </div>
    )
  }

  // Quick Article mode
  if (mode === "quick-article" && blocks.length === 0 && !title) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode("templates")} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-primary">Quick Article</h1>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Title</label>
            <input value={title} onChange={(e) => titleToSlug(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition" placeholder="Article title" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition">
                <option value="AI">AI</option>
                <option value="Gaming">Gaming</option>
                <option value="Esports">Esports</option>
                <option value="Tech">Tech</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Content</label>
            <textarea
              value={quickContent}
              onChange={(e) => setQuickContent(e.target.value)}
              rows={12}
              className="w-full bg-page border border-line rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm leading-relaxed transition"
              placeholder={`Write your article here.

Use ## for headings, - for lists.

Separate paragraphs with a blank line.`}
            />
            <p className="text-xs text-dim mt-1.5">Supports: ## headings, - bullet lists, plain paragraphs</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={convertQuickArticle} disabled={!quickContent.trim()} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition disabled:opacity-50 shadow-lg shadow-accent/20">
              Continue to Block Editor
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Quick Write mode
  if (mode === "quick-write" && blocks.length === 0 && !title) {
    return (
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode("templates")} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
          </button>
          <h1 className="text-xl font-bold text-primary">Quick Write (Markdown)</h1>
        </div>

        <div className="rounded-2xl border border-line bg-card p-6 md:p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Title</label>
              <input value={title} onChange={(e) => titleToSlug(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition" placeholder="Article title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition">
                <option value="AI">AI</option>
                <option value="Gaming">Gaming</option>
                <option value="Esports">Esports</option>
                <option value="Tech">Tech</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-1.5">Markdown Content</label>
            <textarea
              value={quickWriteText}
              onChange={(e) => setQuickWriteText(e.target.value)}
              rows={14}
              className="w-full bg-page border border-line rounded-xl px-4 py-3 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm font-mono leading-relaxed transition"
              placeholder={`# Heading 1
## Heading 2
### Heading 3

Paragraph text goes here. It can be multiple sentences.

- Bullet item 1
- Bullet item 2
- Bullet item 3

1. Numbered item 1
2. Numbered item 2

> Quote text here

\`\`\`javascript
const x = 1;
console.log(x);
\`\`\`

https://example.com/image.jpg

---`}
            />
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              {["# ## ### Headings", "- * Bullet lists", "1. Numbered lists", "> Quotes", "``` Code blocks", "--- Divider", "image.jpg Auto-image"].map((h) => (
                <span key={h} className="px-2.5 py-1 rounded-full bg-page border border-line text-dim">{h}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={convertQuickWrite} disabled={!quickWriteText.trim()} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition disabled:opacity-50 shadow-lg shadow-accent/20">
              Convert to Blocks
            </button>
          </div>
        </div>
      </div>
    )
  }

  // === Block Editor (shown after format/quick article/quick write) ===
  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-primary tracking-tight">{editPostId ? "Edit Article" : "Create Article"}</h1>
          {format && <span className="text-xs text-dim bg-page border border-line px-2.5 py-1 rounded-full">{formats.find((f) => f.id === format)?.label}</span>}
          {!format && blocks.length > 0 && <span className="text-xs text-dim bg-page border border-line px-2.5 py-1 rounded-full">Custom</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-[11px] text-dim mr-2">
            {blocks.length > 0 && <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Auto-saved</span>}
          </div>
          {!editPostId && (
            <button onClick={() => { setMode("templates"); setFormat(null); setTitle(""); setSlug(""); setExcerpt(""); setFeaturedImage(""); setBlocks([]); setQuickWriteText(""); setQuickContent("") }} className="px-3 py-2 rounded-lg text-xs font-medium border border-line text-secondary hover:text-primary hover:bg-card-alt transition">
              New
            </button>
          )}
          <button onClick={() => setPreview(!preview)} className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${preview ? "bg-accent text-white border-accent" : "border-line text-secondary hover:text-primary hover:bg-card-alt"}`}>
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {preview ? (
        /* === PREVIEW MODE === */
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-line bg-card p-8 mb-6">
            {featuredImage && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 bg-page">
                <img src={featuredImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="mb-4">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-wide bg-gradient-to-r from-violet-500/20 to-purple-600/20 text-violet-400 border border-violet-500/20`}>{category}</span>
            </div>
            <h1 className="text-4xl font-bold text-primary leading-tight mb-4">{title || "Untitled"}</h1>
            {excerpt && <p className="text-lg text-secondary mb-6 leading-relaxed">{excerpt}</p>}
          </div>
          <div className="space-y-6">
            {blocks.map((block) => (
              <InlineBlock
                key={block.id}
                block={block}
                editingId={editingBlockId}
                onStartEdit={setEditingBlockId}
                onUpdate={(key, val) => updateBlock(block.id, key, val)}
                onFinishEdit={() => setEditingBlockId(null)}
                editRef={editRef}
              />
            ))}
          </div>
        </div>
      ) : (
        /* === EDIT MODE === */
        <>
          {/* Meta Fields */}
          <div className="rounded-2xl border border-line bg-card p-6 md:p-8 mb-6 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-line">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
              </div>
              <p className="text-sm font-medium text-primary">Article Details</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Title</label>
              <input value={title} onChange={(e) => titleToSlug(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm" placeholder="Article title" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm" placeholder="article-slug" />
              </div>
<div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent text-sm transition">
                <option value="AI">AI</option>
                <option value="Gaming">Gaming</option>
                <option value="Esports">Esports</option>
                <option value="Tech">Tech</option>
              </select>
            </div>
              <div>
                <label className="block text-sm font-medium text-secondary mb-1.5">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm">
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1.5">Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full bg-page border border-line rounded-xl px-4 py-2.5 text-primary placeholder-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition text-sm" placeholder="Brief description for preview cards" />
            </div>
            <div>
              <ImageUploader value={featuredImage} onChange={setFeaturedImage} label="Featured Image" />
            </div>
          </div>

          {/* Block Editor */}
          <div className="rounded-2xl border border-line bg-card p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </div>
                <h2 className="text-base font-semibold text-primary">Content Blocks</h2>
              </div>
              <span className="text-xs text-dim bg-page border border-line px-2.5 py-1 rounded-full">{blocks.length} block{blocks.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-6 p-2 rounded-xl bg-page border border-line/50">
              <AddBlockButton label="Heading" icon={<span className="font-bold text-sm">H</span>} onClick={() => addBlock("heading")} />
              <AddBlockButton label="Text" icon={<span className="text-sm">¶</span>} onClick={() => addBlock("paragraph")} />
              <AddBlockButton label="Image" icon={<span className="text-sm">🖼</span>} onClick={() => addBlock("image")} />
              <AddBlockButton label="Link" icon={<span className="text-sm">🔗</span>} onClick={() => addBlock("link")} />
              <AddBlockButton label="Quote" icon={<span className="text-sm">💬</span>} onClick={() => addBlock("quote")} />
              <AddBlockButton label="Code" icon={<span className="text-[10px] font-mono font-bold">&lt;/&gt;</span>} onClick={() => addBlock("code")} />
              <AddBlockButton label="List" icon={<span className="text-sm">≡</span>} onClick={() => addBlock("list")} />
              <AddBlockButton label="Divider" icon={<span className="text-sm">—</span>} onClick={() => addBlock("divider")} />
            </div>

            {blocks.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-page border border-dashed border-line">
                  <svg className="h-7 w-7 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <p className="text-muted text-sm">Click any block type above to start building</p>
              </div>
            ) : (
              <div className="space-y-3">
                {blocks.map((block, index) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => setDragIndex(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={() => setDragIndex(null)}
                    className={`group relative rounded-xl border transition-all ${dragIndex === index ? "opacity-30 border-accent scale-[0.98]" : "border-line hover:border-line-hover hover:shadow-sm"} bg-card p-4`}
                  >
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-line/50">
                      <span className="cursor-grab active:cursor-grabbing text-muted hover:text-primary transition" title="Drag to reorder">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" /></svg>
                      </span>
                      <span className="text-[11px] font-mono text-dim bg-page px-1.5 py-0.5 rounded">{String(index + 1).padStart(2, "0")}</span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">{block.type}</span>
                    </div>

                    <BlockInputs block={block} updateBlock={updateBlock} updateBlockItem={updateBlockItem} addListItem={addListItem} removeListItem={removeListItem} />

                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => duplicateBlock(block)} className="p-1.5 rounded text-muted hover:text-primary hover:bg-page transition" title="Duplicate">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </button>
                      <button onClick={() => removeBlock(block.id)} className="p-1.5 rounded text-muted hover:text-red-400 hover:bg-red-900/20 transition" title="Delete">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="px-6 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent/90 transition shadow-lg shadow-accent/20">Save Article</button>
            <button onClick={() => { setBlocks([]); setTitle(""); setSlug(""); setExcerpt(""); setFeaturedImage(""); setCategory("AI"); setStatus("Draft"); clearDraft() }} className="px-6 py-2.5 rounded-xl text-sm font-medium border border-line text-secondary hover:text-primary hover:bg-card-alt transition">Clear All</button>
          </div>
        </>
      )}
    </>
  )
}

/* ====== Helper Components ====== */

function ModeTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-accent text-white shadow-sm" : "text-muted hover:text-secondary"}`}>
      <span>{icon}</span> {label}
    </button>
  )
}

function AddBlockButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-secondary hover:text-primary hover:bg-card border border-transparent hover:border-line transition">
      {icon} {label}
    </button>
  )
}

function BlockInputs({
  block, updateBlock, updateBlockItem, addListItem, removeListItem
}: {
  block: Block
  updateBlock: (id: string, key: string, value: string | string[]) => void
  updateBlockItem: (id: string, itemIndex: number, value: string) => void
  addListItem: (id: string) => void
  removeListItem: (id: string, itemIndex: number) => void
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <select value={block.data.level as string} onChange={(e) => updateBlock(block.id, "level", e.target.value)} className="bg-card border border-line rounded-lg px-3 py-1.5 text-xs text-secondary focus:outline-none focus:border-line-hover">
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
          <input value={block.data.text as string} onChange={(e) => updateBlock(block.id, "text", e.target.value)} className="w-full bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm" placeholder="Enter heading text..." />
        </div>
      )
    case "paragraph":
      return (
        <textarea value={block.data.text as string} onChange={(e) => updateBlock(block.id, "text", e.target.value)} rows={3} className="w-full bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm leading-relaxed" placeholder="Write your paragraph..." />
      )
    case "image":
      return (
        <div className="space-y-2">
          <ImageUploader value={block.data.src as string} onChange={(val) => updateBlock(block.id, "src", val)} />
          <div className="flex gap-2">
            <input value={block.data.alt as string} onChange={(e) => updateBlock(block.id, "alt", e.target.value)} className="flex-1 bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm" placeholder="Alt text" />
            <input value={block.data.caption as string} onChange={(e) => updateBlock(block.id, "caption", e.target.value)} className="flex-1 bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm" placeholder="Caption" />
          </div>
        </div>
      )
    case "link":
      return (
        <div className="flex gap-2">
          <input value={block.data.url as string} onChange={(e) => updateBlock(block.id, "url", e.target.value)} className="flex-1 bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm font-mono" placeholder="https://example.com" />
          <input value={block.data.label as string} onChange={(e) => updateBlock(block.id, "label", e.target.value)} className="flex-1 bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm" placeholder="Link label" />
          <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer px-2">
            <input type="checkbox" checked={block.data.newTab === "true"} onChange={(e) => updateBlock(block.id, "newTab", e.target.checked ? "true" : "false")} className="rounded border-line" /> New tab
          </label>
        </div>
      )
    case "quote":
      return (
        <div className="space-y-2">
          <textarea value={block.data.text as string} onChange={(e) => updateBlock(block.id, "text", e.target.value)} rows={2} className="w-full bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm italic" placeholder="Quote text..." />
          <input value={block.data.author as string} onChange={(e) => updateBlock(block.id, "author", e.target.value)} className="w-full bg-card border border-line rounded-lg px-3 py-2 text-secondary placeholder-muted focus:outline-none focus:border-line-hover text-sm" placeholder="Author" />
        </div>
      )
    case "code":
      return (
        <div className="space-y-2">
          <select value={block.data.language as string} onChange={(e) => updateBlock(block.id, "language", e.target.value)} className="bg-card border border-line rounded-lg px-3 py-1.5 text-xs text-secondary focus:outline-none focus:border-line-hover">
            {["javascript", "typescript", "python", "html", "css", "bash", "json", "sql", "rust", "go", "other"].map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <textarea value={block.data.code as string} onChange={(e) => updateBlock(block.id, "code", e.target.value)} rows={5} className="w-full bg-card border border-line rounded-lg px-3 py-2 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm font-mono leading-relaxed" placeholder="// Your code here" spellCheck={false} />
        </div>
      )
    case "list":
      return (
        <div className="space-y-2">
          <select value={block.data.style as string} onChange={(e) => updateBlock(block.id, "style", e.target.value)} className="bg-card border border-line rounded-lg px-3 py-1.5 text-xs text-secondary focus:outline-none focus:border-line-hover">
            <option value="bullet">Bullet list</option>
            <option value="numbered">Numbered list</option>
          </select>
          <div className="space-y-1.5">
            {(block.data.items as string[]).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-muted text-xs shrink-0">{block.data.style === "numbered" ? `${i + 1}.` : "•"}</span>
                <input value={item} onChange={(e) => updateBlockItem(block.id, i, e.target.value)} className="flex-1 bg-card border border-line rounded-lg px-3 py-1.5 text-primary placeholder-muted focus:outline-none focus:border-line-hover text-sm" placeholder={`Item ${i + 1}`} />
                <button onClick={() => removeListItem(block.id, i)} className="text-muted hover:text-red-400 transition p-1"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
              </div>
            ))}
          </div>
          <button onClick={() => addListItem(block.id)} className="flex items-center gap-1 text-xs text-muted hover:text-primary transition py-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> Add item
          </button>
        </div>
      )
    case "divider":
      return (
        <div className="flex items-center gap-2 text-xs text-muted">
          <div className="flex-1 border-t border-line" />
          <span>Divider</span>
          <div className="flex-1 border-t border-line" />
        </div>
      )
    default:
      return null
  }
}

function InlineBlock({ block, editingId, onStartEdit, onUpdate, onFinishEdit, editRef }: {
  block: Block
  editingId: string | null
  onStartEdit: (id: string | null) => void
  onUpdate: (key: string, value: string) => void
  onFinishEdit: () => void
  editRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  const isEditing = editingId === block.id

  if (isEditing) {
    const textValue = (block.data.text || block.data.code || "") as string
    return (
      <textarea
        ref={editRef}
        value={textValue}
        onChange={(e) => onUpdate(block.type === "code" ? "code" : "text", e.target.value)}
        onBlur={onFinishEdit}
        onKeyDown={(e) => { if (e.key === "Escape") onFinishEdit() }}
        rows={4}
        className="w-full bg-card border border-accent rounded-xl p-4 text-primary text-sm focus:outline-none"
        autoFocus
      />
    )
  }

  switch (block.type) {
    case "heading": {
      const text = block.data.text as string
      if (!text) return null
      const Comp = (block.data.level as string) === "h1" ? "h1" : (block.data.level as string) === "h3" ? "h3" : "h2"
      const cls = (block.data.level as string) === "h1" ? "text-3xl font-bold" : (block.data.level as string) === "h3" ? "text-xl font-semibold" : "text-2xl font-bold"
      return <Comp className={`${cls} text-primary cursor-pointer hover:bg-filter/50 rounded-lg px-2 -mx-2 transition`} onClick={() => onStartEdit(block.id)}>{text}</Comp>
    }
    case "paragraph": {
      const text = block.data.text as string
      if (!text) return null
      return <p className="text-base text-secondary leading-relaxed cursor-pointer hover:bg-filter/50 rounded-lg px-2 -mx-2 transition" onClick={() => onStartEdit(block.id)}>{text}</p>
    }
    case "image": {
      const src = block.data.src as string
      if (!src) return null
      return (
        <figure>
          <img src={src} alt={block.data.alt as string} className="w-full rounded-xl" />
          {block.data.caption && <figcaption className="mt-2 text-sm text-muted text-center italic">{block.data.caption as string}</figcaption>}
        </figure>
      )
    }
    case "link": {
      const url = block.data.url as string
      const label = block.data.label as string
      if (!url || !label) return null
      return (
        <a href={url} target={block.data.newTab === "true" ? "_blank" : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent hover:underline text-sm font-medium">
          {label}
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
        </a>
      )
    }
    case "quote": {
      const text = block.data.text as string
      if (!text) return null
      return (
        <blockquote className="border-l-4 border-accent pl-5 py-2">
          <p className="text-lg text-primary italic">{text}</p>
          {block.data.author && <cite className="text-sm text-muted mt-1 block">— {block.data.author as string}</cite>}
        </blockquote>
      )
    }
    case "code": {
      const code = block.data.code as string
      if (!code) return null
      return (
        <pre className="rounded-xl bg-card border border-line p-4 overflow-x-auto cursor-pointer hover:bg-card-alt transition" onClick={() => onStartEdit(block.id)}>
          <code className="text-sm text-primary font-mono leading-relaxed whitespace-pre">{code}</code>
        </pre>
      )
    }
    case "list": {
      const items = block.data.items as string[]
      const style = block.data.style as string
      const filtered = items.filter((i) => i.trim())
      if (filtered.length === 0) return null
      const ListTag = style === "numbered" ? "ol" : "ul"
      return (
        <ListTag className={`${style === "numbered" ? "list-decimal" : "list-disc"} pl-5 space-y-1.5`}>
          {filtered.map((item, i) => <li key={i} className="text-secondary text-sm">{item}</li>)}
        </ListTag>
      )
    }
    case "divider":
      return <hr className="border-line" />
    default:
      return null
  }
}
