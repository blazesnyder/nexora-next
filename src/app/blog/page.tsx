import { getPublishedPosts, getSettings } from "@/lib/server-db"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import BlogClient from "./BlogClient"

export const dynamic = "force-dynamic"

export default function BlogPage() {
  const posts = getPublishedPosts()
  const settings = getSettings()

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <BlogClient posts={posts} settings={settings} />
      </main>
      <Footer />
    </div>
  )
}
