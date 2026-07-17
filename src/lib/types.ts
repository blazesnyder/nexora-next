import { SEED_POSTS_META } from "./blog-data"
import seedBlocks from "./seed-blocks.json"

export type AdminPost = {
  id: string
  title: string
  slug: string
  category: "AI" | "Gaming" | "Esports" | "Tech"
  status: "Draft" | "Published"
  blocks: unknown[]
  featuredImage?: string
  excerpt?: string
  authorEmail?: string
  createdAt: string
  updatedAt: string
}

export type AdminUserEntry = {
  id: string
  email: string
  name: string
  roles: string[]
  avatar?: string
  bio?: string
  website?: string
  password?: string
  createdAt: string
  jobTitle?: string
  expertise?: string[]
  slug?: string
  showOnAuthors?: boolean
  twitter?: string
  github?: string
  linkedin?: string
  youtube?: string
  twitch?: string
  theme?: "light" | "dark" | "system"
  timezone?: string
  language?: string
  notifyComments?: boolean
  notifyUsers?: boolean
  notifyDigest?: boolean
  twoFactorEnabled?: boolean
  lastLogin?: string
}

export type MediaItem = {
  id: string
  url: string
  filename: string
  size: number
  type: string
  uploadedAt: string
  uploadedBy: string
}

export type SiteSettings = {
  siteName: string
  siteDescription: string
  postsPerPage: number
  enableComments: boolean
}

export type ActivityEntry = {
  id: string
  action: string
  detail: string
  user: string
  timestamp: string
}

export type CommentEntry = {
  id: string
  postSlug: string
  author: string
  email: string
  content: string
  createdAt: string
  approved: boolean
}

export type ContactEntry = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

export type AnalyticsEntry = {
  id: string
  page: string
  postSlug?: string
  referrer?: string
  timestamp: string
}

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

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Nexora",
  siteDescription: "AI, Gaming, Esports & Tech — Stay Ahead of the Curve",
  postsPerPage: 9,
  enableComments: false,
}

export const DEFAULT_USERS: AdminUserEntry[] = [
  { id: "1", email: "admin@nexora.com", name: "Admin", roles: ["Full Access", "Editor", "Author"], createdAt: "2026-01-01T00:00:00.000Z" }
]

export const STORE_VERSION = "2026-07-15-v4"

export const seedBlocksData = seedBlocks

const rawSeedBlocks = seedBlocks as Record<string, Array<{ type: string; data: unknown }>>

export function addIdsToBlocks(blocks: Array<{ type: string; data: unknown }>) {
  let blockCounter = 0
  return blocks.map((b) => ({ id: `seed-block-${++blockCounter}`, type: b.type, data: b.data }))
}

export const SEED_POSTS: AdminPost[] = (() => {
  let postCounter = 0
  let blockCounter = 0
  const id = () => `seed-post-${++postCounter}`
  const blockId = () => `seed-block-${++blockCounter}`

  const otherBlocksMap: Record<string, unknown[]> = {
    "ai-2026-complete-guide": [
      { id: blockId(), type: "heading", data: { level: "h2", text: "Introduction" } },
      { id: blockId(), type: "paragraph", data: { text: "The AI landscape in 2026 is unrecognizable from just a few years ago. Foundation models have become commodity infrastructure, agent architectures are reshaping enterprise workflows, and entirely new market sectors have emerged around AI-powered services." } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Foundation Models Become Infrastructure" } },
      { id: blockId(), type: "paragraph", data: { text: "By 2026, large language models have evolved from standalone products into ubiquitous infrastructure. Much like cloud computing before them, foundation models are now accessed through APIs that power millions of applications. The competition has shifted from model size to efficiency, with specialized models outperforming general-purpose behemoths in specific domains." } },
      { id: blockId(), type: "quote", data: { text: "The models themselves are becoming commoditized. The real value now lies in how you fine-tune, deploy, and orchestrate them.", author: "Dr. Sarah Chen, AI Research Lead" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "The Rise of AI Agents" } },
      { id: blockId(), type: "paragraph", data: { text: "Autonomous AI agents represent the most significant shift in enterprise technology since the cloud. These agents can plan, execute, and iterate on complex tasks with minimal human supervision. From code generation to customer support, AI agents are transforming how work gets done." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["Customer service agents handling 80% of first-contact resolution", "Code review agents that catch 99% of vulnerabilities", "Data analysis agents generating insights in real-time", "Marketing agents creating and A/B testing content automatically"] } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Practical Pathways" } },
      { id: blockId(), type: "paragraph", data: { text: "For individuals and businesses looking to capitalize on the AI revolution, several pathways have emerged. Building AI-powered SaaS products, offering fine-tuning services, creating specialized datasets, and developing agent workflows are among the most accessible entry points." } },
    ],
    "unreal-engine-6-announced": [
      { id: blockId(), type: "image", data: { src: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop", alt: "Unreal Engine 6 real-time rendering demo", caption: "Unreal Engine 6 real-time path tracing demo at 60fps" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Next-Gen Engine Revealed" } },
      { id: blockId(), type: "paragraph", data: { text: "Epic Games has officially unveiled Unreal Engine 6, marking the biggest leap forward in real-time 3D technology since the introduction of Unreal Engine 5. The new engine promises real-time path tracing at 60fps on consumer hardware, a feat previously thought to be years away." } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Real-Time Path Tracing" } },
      { id: blockId(), type: "paragraph", data: { text: "The marquee feature of UE6 is its fully ray-traced pipeline. Unlike the hybrid approach of UE5, which combined rasterization with selective ray tracing, UE6 processes all lighting, shadows, and reflections through path tracing. This delivers cinema-quality visuals without the need for baked lighting or complex workarounds." } },
      { id: blockId(), type: "quote", data: { text: "We're not just iterating on graphics technology — we're redefining what's possible in real-time rendering.", author: "Tim Sweeney, CEO Epic Games" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Performance Benchmarks" } },
      { id: blockId(), type: "paragraph", data: { text: "Early benchmarks from Epic's internal testing show dramatic improvements across all major GPU architectures. The new Nanite 2.0 system handles 10x more geometric detail than its predecessor, while the Lumen 2.0 global illumination system runs at half the computational cost. Epic claims that a mid-range RTX 5070 can achieve 60fps at 1440p with full ray tracing enabled." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["RTX 5090: 120fps at 4K with full path tracing", "RTX 5070: 60fps at 1440p with full path tracing", "RTX 4060: 45fps at 1080p with full path tracing", "Console targets: 30fps at 4K on PlayStation 6 and next Xbox"] } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Developer Experience Improvements" } },
      { id: blockId(), type: "paragraph", data: { text: "Beyond graphics, UE6 introduces a redesigned editor with AI-assisted workflows. Developers can now generate placeholder assets, write blueprint logic, and debug performance issues using natural language prompts. The new MetaHuman Animator 2.0 can capture and retarget facial performances in real-time from a standard webcam." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["AI-assisted asset generation and level design", "Real-time facial capture from webcam", "Cross-platform deployment with zero-code optimizations", "Backward compatibility with UE5 projects"] } },
      { id: blockId(), type: "image", data: { src: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop", alt: "Unreal Engine 6 editor interface", caption: "The redesigned UE6 editor with AI-powered workflow assistants" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Release Timeline and Pricing" } },
      { id: blockId(), type: "paragraph", data: { text: "Unreal Engine 6 enters early access in Q3 2026, with a full stable release expected by early 2027. Epic has confirmed that the engine will maintain its royalty-based pricing model, with the first $1 million in gross revenue per title exempt from royalties. Educational and non-commercial use remains free." } },
      { id: blockId(), type: "divider", data: {} },
      { id: blockId(), type: "paragraph", data: { text: "Game developers interested in the early access program can apply through Epic's developer portal starting next month." } },
    ],
    "lol-worlds-2026-preview": [
      { id: blockId(), type: "image", data: { src: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop", alt: "League of Legends World Championship stage", caption: "The Worlds 2026 stage design promises to be the most ambitious yet" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "The Biggest Esports Event of the Year" } },
      { id: blockId(), type: "paragraph", data: { text: "The League of Legends World Championship returns in 2026 with a new format, expanded prize pool, and more teams than ever before. With regional leagues stronger than ever, this year's Worlds promises to be the most competitive yet." } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "New Format Breakdown" } },
      { id: blockId(), type: "paragraph", data: { text: "Riot Games has overhauled the tournament structure. The new format features a Swiss stage followed by double-elimination brackets, ensuring that the best teams advance while reducing the impact of single-match upsets. The Play-In stage has been expanded to include emerging regions." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["24 teams from 12 regional leagues", "$5 million prize pool — the largest in esports history", "New Swiss stage format for group phase", "Double-elimination playoffs"] } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Host Cities and Venues" } },
      { id: blockId(), type: "paragraph", data: { text: "Worlds 2026 will be hosted across three European cities, marking the first time the championship has returned to Europe since 2021. The Play-In and Swiss stages will take place in Berlin's Verti Music Hall, quarterfinals and semifinals in Paris' Accor Arena, and the grand finals in London's newly renovated Wembley Stadium." } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Teams to Watch" } },
      { id: blockId(), type: "paragraph", data: { text: "Last year's champions return with a revamped roster, while LCK representatives have shown dominant form in spring split. LPL teams are fielding their strongest lineups in years, and the LEC has been steadily closing the gap. Western fans have reason to hope as NA teams have invested heavily in infrastructure and coaching." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["T1 (LCK) — Back-to-back spring champions with new bot lane duo", "JD Gaming (LPL) — Record-setting regular season performance", "G2 Esports (LEC) — European hope with veteran leadership", "FlyQuest (LCS) — Rebuilt roster with Korean superstars"] } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Broadcast and Viewing Experience" } },
      { id: blockId(), type: "paragraph", data: { text: "Riot has partnered with multiple streaming platforms to ensure worldwide coverage. The championship will be broadcast in 20 languages across Twitch, YouTube, and a new in-client viewing experience that offers interactive features, live stats overlays, and exclusive drops for viewers." } },
      { id: blockId(), type: "image", data: { src: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop", alt: "Esports arena crowd", caption: "Wembley Stadium will host the Worlds 2026 grand finals" } },
      { id: blockId(), type: "quote", data: { text: "Bringing Worlds back to Europe with a multi-city format allows us to share the experience with more fans than ever before.", author: "Naz Aletaha, Global Head of LoL Esports" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Teams to Watch" } },
      { id: blockId(), type: "paragraph", data: { text: "Last year's champions return with a revamped roster, while LCK representatives have shown dominant form in spring split. LPL teams are fielding their strongest lineups in years, and the LEC has been steadily closing the gap. Western fans have reason to hope as NA teams have invested heavily in infrastructure and coaching." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["T1 (LCK) — Back-to-back spring champions with new bot lane duo", "JD Gaming (LPL) — Record-setting regular season performance", "G2 Esports (LEC) — European hope with veteran leadership", "FlyQuest (LCS) — Rebuilt roster with Korean superstars"] } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Broadcast and Viewing Experience" } },
      { id: blockId(), type: "paragraph", data: { text: "Riot has partnered with multiple streaming platforms to ensure worldwide coverage. The championship will be broadcast in 20 languages across Twitch, YouTube, and a new in-client viewing experience that offers interactive features, live stats overlays, and exclusive drops for viewers." } },
      { id: blockId(), type: "divider", data: {} },
      { id: blockId(), type: "paragraph", data: { text: "Ticket sales for the grand finals at Wembley Stadium are expected to sell out within minutes. Early bird registration opens next week through the official LoL Esports website." } },
    ],
    "apple-vision-pro-2": [
      { id: blockId(), type: "image", data: { src: "https://images.unsplash.com/photo-1625842268581-0e3f4c8a7b0a?w=800&h=400&fit=crop", alt: "Apple Vision Pro 2 headset", caption: "The Vision Pro 2 is 35% lighter than its predecessor" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Second Generation Arrives" } },
      { id: blockId(), type: "paragraph", data: { text: "Apple's second-generation spatial computer builds on the foundation of the original Vision Pro with significant improvements across the board. The Vision Pro 2 addresses the main criticisms of its predecessor while introducing capabilities that redefine what a spatial computer can do." } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Hardware Improvements" } },
      { id: blockId(), type: "paragraph", data: { text: "The most noticeable change is the weight reduction. By switching to a magnesium alloy frame and optimizing the laminated glass design, Apple has reduced the headset weight by 35%. The digital crown has been repositioned for easier access, and the light seal now comes in more sizes for a better fit." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["35% lighter than the original Vision Pro", "M4 Ultra chip with 128-core GPU", "New micro-OLED panels with 8K per eye", "12-hour battery life with external pack"] } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Software Ecosystem" } },
      { id: blockId(), type: "paragraph", data: { text: "VisionOS 3 brings spatial personas, collaborative workspaces, and native support for Unity applications. Developers can now create immersive experiences that blend digital content with the physical world more seamlessly than ever. The App Store for Vision Pro has grown to over 10,000 native applications." } },
      { id: blockId(), type: "image", data: { src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=400&fit=crop", alt: "Vision Pro 2 spatial computing interface", caption: "VisionOS 3 introduces collaborative workspaces with spatial personas" } },
      { id: blockId(), type: "quote", data: { text: "Vision Pro 2 isn't just a better headset — it's the first spatial computer that people will actually want to wear all day.", author: "Tim Cook, CEO Apple" } },
      { id: blockId(), type: "heading", data: { level: "h2", text: "Pricing and Availability" } },
      { id: blockId(), type: "paragraph", data: { text: "Starting at $2,999 for the base model with 256GB storage, the Vision Pro 2 is $500 cheaper than the original at launch. Pre-orders begin next Friday, with shipping starting in early August. Apple has also announced a more affordable version, the Vision Air, targeting a $1,999 price point for release in early 2027." } },
      { id: blockId(), type: "list", data: { style: "bullet", items: ["Vision Pro 2: $2,999 (256GB) — available August 2026", "Vision Pro 2 Pro: $3,499 (512GB) with additional sensors", "Vision Air: $1,999 (announced, releasing early 2027)", "Trade-in program available for original Vision Pro owners"] } },
      { id: blockId(), type: "divider", data: {} },
      { id: blockId(), type: "paragraph", data: { text: "Early reviews praise the improved comfort and extended battery life, with many calling it the first spatial computer suitable for all-day use." } },
    ],
  }

  return SEED_POSTS_META.map((meta) => {
    const baseBlocks = meta.slug === "ai-content-monetization-complete-guide"
      ? addIdsToBlocks(rawSeedBlocks[meta.slug] || [])
      : otherBlocksMap[meta.slug] || []
    return {
      id: id(),
      title: meta.title,
      slug: meta.slug,
      category: meta.category,
      status: "Published" as const,
      blocks: baseBlocks,
      featuredImage: meta.slug === "ai-content-monetization-complete-guide"
        ? "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop"
        : "",
      excerpt: meta.excerpt,
      authorEmail: undefined,
      createdAt: meta.date,
      updatedAt: meta.date,
    }
  })
})()