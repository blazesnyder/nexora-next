import { getPublishedPosts, getSettings } from "@/lib/server-db"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CategoryClient from "../CategoryClient"

export const dynamic = "force-dynamic"

const categoryData: Record<string, { name: string; description: string }> = {
  ai: { name: "AI", description: "Latest in artificial intelligence — from LLMs to robotics" },
  gaming: { name: "Gaming", description: "Game reviews, previews, walkthroughs and industry analysis" },
  esports: { name: "Esports", description: "Tournament coverage, team rankings, and competitive play" },
  tech: { name: "Tech", description: "Hardware reviews, software tutorials, and emerging tech trends" },
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const allPosts = getPublishedPosts()
  const settings = getSettings()
  const cat = categoryData[params.slug]

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <CategoryClient
          slug={params.slug}
          cat={cat || null}
          posts={allPosts}
          settings={settings}
        />
      </main>
      <Footer />
    </div>
  )
}
