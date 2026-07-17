"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useMeta } from "@/components/blog/useMeta"
import { useTrackView } from "@/lib/admin-store"
import ArticleContent from "@/components/blog/ArticleContent"
import type { AdminPost, SiteSettings } from "@/lib/admin-store"

export default function PostClient({ post, settings }: { post: AdminPost | null; settings: SiteSettings }) {
  const trackView = useTrackView()

  useMeta(post?.title || "Post", post?.excerpt || "Read this article")

  useEffect(() => {
    if (post?.slug) trackView("blog-post", post.slug)
  }, [trackView, post?.slug])

  if (!post) {
    return (
      <div className="flex items-center justify-center px-4 py-20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-4">Post Not Found</h1>
          <p className="text-muted mb-6">The article you&#39;re looking for doesn&#39;t exist or hasn&#39;t been published yet.</p>
          <Link href="/blog" className="inline-block px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors">
            Browse All Articles
          </Link>
        </div>
      </div>
    )
  }

  return <ArticleContent post={post} settings={settings} />
}
