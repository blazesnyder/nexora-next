"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import BlockEditor from "@/components/admin/BlockEditor"

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-3">
          <Link href="/admin/posts" className="hover:text-primary transition">Posts</Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" /></svg>
          <span className="text-primary truncate max-w-[300px]">Edit</span>
        </div>
      </div>
      <BlockEditor editPostId={id} />
    </div>
  )
}
