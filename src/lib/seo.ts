import type { Metadata } from 'next'

const SITE_NAME = 'Nexora'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nexora.com'

interface GenerateMetadataParams {
  title: string
  description: string
  path: string
  ogImage?: string
  type?: 'website' | 'article'
  publishedTime?: string
  author?: string
  tags?: string[]
}

export function generateMetadata({
  title,
  description,
  path,
  ogImage,
  type = 'website' as const,
  publishedTime,
  author,
  tags,
}: GenerateMetadataParams): Metadata {
  const url = `${SITE_URL}${path}`
  const images = ogImage
    ? [{ url: ogImage, width: 1200, height: 630 }]
    : undefined

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images,
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(author && {
        authors: [author],
      }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  }
}
