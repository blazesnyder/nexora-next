'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbsProps {
  customLabels?: Record<string, string>
}

const defaultLabels: Record<string, string> = {
  '': 'Home',
  blog: 'Blog',
  'ai-agent': 'AI Agents',
  skills: 'Skills',
  codex: 'Codex',
  admin: 'Admin',
}

function toLabel(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function Breadcrumbs({ customLabels = {} }: BreadcrumbsProps) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const labels = { ...defaultLabels, ...customLabels }

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const label = labels[segment] ?? toLabel(segment)
    const isLast = index === segments.length - 1
    return { href, label, isLast }
  })

  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nexora.com'}/`,
    },
    ...crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 2,
      name: crumb.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://nexora.com'}${crumb.href}`,
    })),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement,
          }),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-0">
          <li>
            <Link href="/" className="text-white/40 hover:text-white/70 transition-colors text-sm">
              Home
            </Link>
          </li>
          {crumbs.map((crumb) => (
            <li key={crumb.href} className="flex items-center">
              <span className="text-white/20 mx-2">›</span>
              {crumb.isLast ? (
                <span className="text-white/70 text-sm" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="text-white/40 hover:text-white/70 transition-colors text-sm">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
