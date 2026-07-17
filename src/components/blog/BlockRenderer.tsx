"use client"

export default function BlockRenderer({ blocks }: { blocks: unknown[] }) {
  return (
    <article className="prose-article">
      {blocks.map((b) => {
        const block = b as { id: string; type: string; data: Record<string, string | string[]> }
        switch (block.type) {
          case "heading": {
            const level = (block.data.level as string) || "h2"
            const text = (block.data.text as string) || ""
            if (level === "h1") return <h1 key={block.id}>{text}</h1>
            if (level === "h3") return <h3 key={block.id}>{text}</h3>
            if (level === "h4") return <h4 key={block.id}>{text}</h4>
            return <h2 key={block.id}>{text}</h2>
          }
          case "paragraph": {
            const text = (block.data.text as string) || ""
            return <p key={block.id}>{text}</p>
          }
          case "image": {
            const src = (block.data.src as string) || ""
            const alt = (block.data.alt as string) || ""
            const caption = (block.data.caption as string) || ""
            if (!src) return null
            return (
              <figure key={block.id}>
                <img src={src} alt={alt} className="w-full rounded-xl" />
                {caption && <figcaption>{caption}</figcaption>}
              </figure>
            )
          }
          case "link": {
            const url = (block.data.url as string) || ""
            const label = (block.data.label as string) || url
            const newTab = block.data.newTab === "true"
            return (
              <p key={block.id}>
                <a href={url} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>
                  {label}
                </a>
              </p>
            )
          }
          case "quote": {
            const text = (block.data.text as string) || ""
            const author = (block.data.author as string) || ""
            return (
              <blockquote key={block.id}>
                <p>{text}</p>
                {author && <cite>&mdash; {author}</cite>}
              </blockquote>
            )
          }
          case "code": {
            const code = (block.data.code as string) || ""
            const language = (block.data.language as string) || ""
            return (
              <pre key={block.id}>
                {language && <span className="text-xs text-dim block mb-1 font-mono">{language}</span>}
                <code>{code}</code>
              </pre>
            )
          }
          case "list": {
            const items = (block.data.items as string[]) || []
            const style = block.data.style as string
            if (style === "numbered") {
              return (
                <ol key={block.id}>
                  {items.map((item, i) => <li key={i}>{item}</li>)}
                </ol>
              )
            }
            return (
              <ul key={block.id}>
                {items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )
          }
          case "divider":
            return <hr key={block.id} />
          default:
            return null
        }
      })}
    </article>
  )
}
