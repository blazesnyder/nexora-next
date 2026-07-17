import { getPostBySlug, getSettings } from "@/lib/server-db"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import PostClient from "./PostClient"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  const settings = getSettings()

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <PostClient post={post} settings={settings} />
      </main>
      <Footer />
    </div>
  )
}
