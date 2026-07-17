# Codex Content Template — Nexora

## Writing Guidelines

### Tone & Style
- **Encyclopedia tone** — objective, factual, concise. No opinion, no fluff.
- **Onion-skin principle**: Start with the simplest 1-2 sentence definition, then expand.
- **Length**: Glossary entries 300-800 words. FAQ entries 500-1200 words.

### E-E-A-T Requirements (Mandatory)
- Author must cite authoritative sources for definitions
- Technical accuracy is critical — fact-check all claims
- Author bio should include domain expertise (e.g., "AI Engineer" for AI terms)
- For FAQ entries, answers must be backed by source links

### SEO Rules
- Primary keyword = the term itself
- Meta title formula: `"What is {{ Term }}? Definition, Examples & FAQs"`
- Featured snippet format: First paragraph must define term in 1-2 sentences
- FAQ schema for Q&A entries (rich results in search)
- Internal links to related codex terms and skills
- Alphabetical category organization

### AdSense Rules
- Max 2 ad units per page (codex entries are shorter)
- First ad: after the extended definition section
- Second ad: after FAQ section or at end
- No ads in the short definition (above the fold)

### Analytics Events
- `view_term` — on page load
- `click_related_term` — user clicks cross-reference link
- `expand_faq` — user opens an FAQ accordion
- `search_codex` — user searches within codex

---

## Template — Codex Glossary Entry

### Frontmatter

```yaml
title: "What is {{ Term }}? Definition & Examples"
slug: "{{ term-slug }}"
category: "{{ AI | Gaming | Esports | Tech | Development }}"
date: {{ YYYY-MM-DD }}
author: "{{ Author Name }}"
author_bio: "{{ Relevant credentials }}"
featured_image: "/images/codex/{{ term-slug }}.jpg"
tags: ["{{ Category }}", "{{ Related Topic }}"]
related_terms: ["{{ Related Term 1 }}", "{{ Related Term 2 }}", "{{ Related Term 3 }}"]
meta_title: "What is {{ Term }}? — Definition, Examples & Related Terms"
meta_description: "{{ Term }} explained simply: {{ 1 sentence definition }}. Learn the meaning, see examples, and explore related terms in the Nexora Codex."
canonical_url: "https://nexora.com/codex/{{ term-slug }}"
```

### Content Structure

```markdown
# What is {{ Term }}? — Definition & Examples

{{ 1-2 sentence definition. This is the AI Overview answer. Keep it tight. }}

{{ Optional: 1-2 sentence expansion. }}

## Definition
{{ 2-3 paragraph detailed explanation. Include:
- Origin/etymology of the term
- How it's used in practice
- Concrete examples
- Why it matters }}

### Example
```
{{ Code or practical example if applicable }}
```

{{ AD IN-ARTICLE: AdUnit after definition }}

## Related Terms
| Term | Definition |
|------|------------|
| [{{ Related Term 1 }}](/codex/{{ related-term-1 }}) | {{ Short definition }} |
| [{{ Related Term 2 }}](/codex/{{ related-term-2 }}) | {{ Short definition }} |

## Related Skills
- [How to {{ Related Skill 1 }}](/skills/how-to-{{ related-skill-1 }})
- [How to {{ Related Skill 2 }}](/skills/how-to-{{ related-skill-2 }})

## Sources
- {{ Source name }}: {{ URL }}
- {{ Source name }}: {{ URL }}

{{ AD END: AdUnit after content }}
```

---

## Template — Codex FAQ Entry

```markdown
# {{ Question/Term }}: {{ Subtitle }}

{{ 1-2 sentence direct answer. }}

## {{ Related Question 1 }}?
{{ Answer with details, examples, and sources. }}

## {{ Related Question 2 }}?
{{ Answer. }}

## {{ Related Question 3 }}?
{{ Answer. }}

---

### Still have questions?
{{ Call to action encouraging more exploration. }}
```

---

## JSON-LD Schema (Copy-Paste)

### DefinedTerm Schema (for glossary)
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": "{{ Term }}",
  "description": "{{ 1 sentence definition }}",
  "inDefinedTermSet": "Nexora Codex"
}
</script>
```

### FAQPage Schema (for FAQ entries)
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{{ Question 1 }}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ Answer text }}"
      }
    },
    {
      "@type": "Question",
      "name": "{{ Question 2 }}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ Answer text }}"
      }
    }
  ]
}
</script>
```

### BreadcrumbList
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://nexora.com/" },
    { "@type": "ListItem", "position": 2, "name": "Codex", "item": "https://nexora.com/codex" },
    { "@type": "ListItem", "position": 3, "name": "{{ Term }}" }
  ]
}
</script>
```

---

## Category Organization

| Category | Example Terms | Color |
|----------|--------------|-------|
| AI | LLM, RAG, Fine-tuning, Transformer, Token | Purple |
| Gaming | FPS, RPG, Hitbox, Lag, Ping, Ray Tracing | Green |
| Esports | KDA, MMR, Scrim, Bracket, Bo3, Ace | Orange |
| Tech | API, SDK, Docker, CI/CD, Microservices | Blue |
| Development | TypeScript, React, Node.js, Git, GraphQL | Cyan |

---

## Internal Links (Required)

Link to:
1. **Related codex term**: `{{ /codex/related-term }}`
2. **Related skill**: `{{ /skills/how-to-related-skill }}`
3. **Related blog/AI agent**: `{{ /ai-agent/relevant-review }}`

---

## Publishing Checklist

- [ ] Meta title ≤60 chars
- [ ] Meta description 120-160 chars
- [ ] First paragraph is a clean 1-2 sentence definition
- [ ] Featured image or relevant icon
- [ ] All sources cited
- [ ] Related terms filled in (minimum 2)
- [ ] Internal links to related codex + skill pages
- [ ] JSON-LD schema added (DefinedTerm or FAQPage)
- [ ] Ad placements at correct positions
- [ ] Category assigned
- [ ] Tags added (max 5)
- [ ] Published time set
