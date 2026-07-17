"use client"

import Link from "next/link"

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  queryParams = {},
}: {
  currentPage: number
  totalPages: number
  basePath: string
  queryParams?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  const pages: (number | "...")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  const buildQuery = (params: Record<string, string | undefined>) => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value)
    })
    return searchParams.toString()
  }

  const href = (p: number) => {
    const query = buildQuery({ ...queryParams, page: String(p) })
    return query ? `${basePath}?${query}` : basePath
  }

  return (
    <nav className="mt-14 flex items-center justify-center gap-6">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)}
          className="text-white/40 hover:text-white transition-colors text-sm">
            ← Previous
        </Link>
      ) : (
        <span className="text-white/40 text-sm cursor-not-allowed">
          ← Previous
        </span>
      )}

      <div className="hidden sm:flex items-center gap-6">
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="text-white/40 text-sm">...</span>
          ) : (
            <Link key={p} href={href(p)}
              className={`text-sm transition-colors ${
                p === currentPage
                  ? "text-white"
                  : "text-white/40 hover:text-white"
              }`}>
              {p}
            </Link>
          )
        )}
      </div>

      <span className="sm:hidden text-sm text-white/40">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)}
          className="text-white/40 hover:text-white transition-colors text-sm">
            Next →
        </Link>
      ) : (
        <span className="text-white/40 text-sm cursor-not-allowed">
          Next →
        </span>
      )}
    </nav>
  )
}
