import { NextResponse } from "next/server"
import { getAllPosts, createPost, seedInitialData } from "@/lib/db"
import { SEED_POSTS } from "@/lib/types"

export async function GET() {
  const posts = getAllPosts()
  if (posts.length === 0) {
    seedInitialData(SEED_POSTS)
  }
  return NextResponse.json(getAllPosts())
}

export async function POST(request: Request) {
  const body = await request.json()
  const post = createPost(body)
  return NextResponse.json(post, { status: 201 })
}