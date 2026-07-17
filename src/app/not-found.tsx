import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-transparent px-6">
      <span className="text-6xl font-bold text-white select-none">404</span>
      <h1 className="mt-6 text-2xl font-bold text-white">Page not found</h1>
      <p className="mt-2 text-white/60 leading-relaxed text-center max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-8 text-accent hover:text-white transition-colors font-medium"
      >
        Go Home
      </Link>
    </div>
  )
}
