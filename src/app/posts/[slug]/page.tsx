"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  useEffect(() => {
    router.replace(`/blog/${slug}`)
  }, [slug, router])

  return null
}
