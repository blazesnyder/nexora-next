"use client"

import BlockEditor from "@/components/admin/BlockEditor"
import Link from "next/link"

export default function NewPost() {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/admin/posts" className="hover:text-primary transition">Posts</Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
        <span className="text-primary font-medium">New Article</span>
      </div>
      <BlockEditor />
    </div>
  )
}
