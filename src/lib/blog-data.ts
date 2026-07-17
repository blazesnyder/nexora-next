export type BlogPostMeta = {
  title: string
  slug: string
  excerpt: string
  category: "AI" | "Gaming" | "Esports" | "Tech"
  date: string
}

export const SEED_POSTS_META: BlogPostMeta[] = [
  {
    title: "AI in 2026: The Complete Guide to Foundation Models, Agents, and the AI Economy",
    slug: "ai-2026-complete-guide",
    excerpt: "A comprehensive analysis of the AI landscape in 2026 covering foundation models, agent architectures, market sectors, and practical pathways to generate income in the AI economy.",
    category: "AI",
    date: "2026-01-15T10:00:00.000Z",
  },
  {
    title: "AI Content Monetization: Complete Guide to Building Revenue Streams",
    slug: "ai-content-monetization-complete-guide",
    excerpt: "Discover how to leverage AI tools for content creation, audience building, and revenue generation. From automated writing and video production to personalized marketing and passive income streams — this comprehensive guide covers every strategy you need to monetize content in the AI era.",
    category: "AI",
    date: "2026-01-10T10:00:00.000Z",
  },
  {
    title: "Unreal Engine 6 Announced: Real-Time Path Tracing, AI-Assisted Development, and Redesigned Editor",
    slug: "unreal-engine-6-announced",
    excerpt: "Epic Games unveils its next-gen engine with real-time path tracing, AI-assisted development tools, and a redesigned editor built for the next generation of game creators.",
    category: "Gaming",
    date: "2026-01-08T10:00:00.000Z",
  },
  {
    title: "League of Legends Worlds 2026 Preview: New Format, Expanded Prize Pool, 24 Teams from 12 Regions",
    slug: "lol-worlds-2026-preview",
    excerpt: "The biggest esports event of the year returns with a brand-new format, expanded prize pool, and 24 teams from 12 regions competing for the Summoner's Cup.",
    category: "Esports",
    date: "2026-01-05T10:00:00.000Z",
  },
  {
    title: "Apple Vision Pro 2: 35% Lighter, M4 Ultra Chip, 8K Per Eye Displays, 12-Hour Battery Life",
    slug: "apple-vision-pro-2",
    excerpt: "Apple's second-gen spatial computer arrives with 35% lighter design, M4 Ultra chip, 8K per eye displays, and 12-hour battery life — a massive leap forward for spatial computing.",
    category: "Tech",
    date: "2026-01-01T10:00:00.000Z",
  },
]