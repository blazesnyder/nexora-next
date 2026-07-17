import { SEED_POSTS_META } from "@/lib/blog-data"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexora.com"

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function buildRssXml(): string {
  const itemsXml = SEED_POSTS_META
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <description>${escapeXml(p.excerpt)}</description>
      <link>${escapeXml(`${BASE_URL}/blog/${p.slug}`)}</link>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(`${BASE_URL}/blog/${p.slug}`)}</guid>
    </item>`
    )
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:category="http://purl.org/rss/1.0/modules/syndication/">
  <channel>
    <title>Nexora</title>
    <description>Your ultimate destination for AI, gaming, esports, and tech content.</description>
    <link>${escapeXml(BASE_URL)}</link>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(BASE_URL)}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`
}

export async function GET() {
  const xmlContent = buildRssXml()
  return new Response(xmlContent, {
    headers: { "Content-Type": "application/xml" },
  })
}
