import { sendGAEvent } from '@next/third-parties/google'

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

function hasGtag(): boolean {
  if (typeof window === 'undefined') return false
  return typeof window.gtag === 'function'
}

export function trackArticleRead(title: string, percent: number): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'article_read', {
    article_title: title,
    read_percent: Math.round(percent),
  })
}

export function trackDownload(contentType: string, title: string): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'download', {
    content_type: contentType,
    file_title: title,
  })
}

export function trackSearch(query: string, resultsCount: number): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'search', {
    search_term: query,
    results_count: resultsCount,
  })
}

export function trackNewsletterSignup(location: string): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'newsletter_signup', {
    signup_location: location,
  })
}

export function trackExternalLink(url: string, contentType: string): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'external_link_click', {
    destination_url: url,
    content_type: contentType,
  })
}

export function trackCopyCode(skillTitle: string): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'copy_code', {
    skill_title: skillTitle,
  })
}

export function trackAdClick(adSlot: string): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'ad_click', {
    ad_slot: adSlot,
  })
}

export function trackPageView(path: string, title: string): void {
  if (typeof window === 'undefined') return
  sendGAEvent('event', 'page_view', {
    page_path: path,
    page_title: title,
  })
}
