import { NextResponse } from "next/server"
import { getAllPosts, createPost, updatePost } from "@/lib/db"

export async function POST(request: Request) {
  const { posts: incoming } = await request.json()
  const existing = getAllPosts()
  const existingSlugs = new Set(existing.map((p) => p.slug))

  for (const post of incoming) {
    if (existingSlugs.has(post.slug)) {
      updatePost(post.slug, post)
    } else {
      createPost(post)
    }
  }

  return NextResponse.json({ success: true })
}