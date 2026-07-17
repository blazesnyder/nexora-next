import { useEffect } from "react"

export function useMeta(title: string, description?: string, image?: string) {
  useEffect(() => {
    const siteName = "Nexora"
    const fullTitle = title ? `${title} — ${siteName}` : siteName

    document.title = fullTitle

    const setMeta = (name: string, content: string) => {
      if (!content) return
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLElement | null
      if (!el) {
        el = document.createElement("meta")
        if (name.startsWith("og:")) {
          el.setAttribute("property", name)
        } else {
          el.setAttribute("name", name)
        }
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }

    setMeta("description", description || "")
    setMeta("og:title", fullTitle)
    setMeta("og:description", description || "")
    setMeta("og:type", "website")
    setMeta("og:site_name", siteName)
    if (image) setMeta("og:image", image)
    setMeta("twitter:card", "summary_large_image")
    setMeta("twitter:title", fullTitle)
    setMeta("twitter:description", description || "")
    if (image) setMeta("twitter:image", image)
  }, [title, description, image])
}

export function useArticleMeta(title: string, description?: string, image?: string, author?: string, publishedAt?: string) {
  useMeta(title, description, image)

  useEffect(() => {
    const setMeta = (name: string, content: string) => {
      if (!content) return
      let el = document.querySelector(`meta[property="${name}"]`) as HTMLElement | null
      if (!el) {
        el = document.createElement("meta")
        el.setAttribute("property", name)
        document.head.appendChild(el)
      }
      el.setAttribute("content", content)
    }
    setMeta("og:type", "article")
    setMeta("article:published_time", publishedAt || "")
    setMeta("article:author", author || "")
  }, [author, publishedAt])
}
