# AI Agent Content Template — Nexora

## Writing Guidelines

### Tone & Style
- **Objective & informative** — no hype, no fluff. State facts.
- **Review tone** for reviews: balanced, pros/cons, comparison-driven.
- **News tone** for updates: timely, concise, source-cited.
- **Length**: Reviews 1500-2500 words. News 500-800 words.

### E-E-A-T Requirements (Mandatory)
- Author must state real experience: _"I tested {{ Agent }} for {{ X }} days/weeks"_
- Include real screenshots of using the agent (not marketing images)
- Cite sources for all claims (pricing, features, benchmarks)
- Author bio must include relevant credentials (years in AI, job title, etc.)

### SEO Rules
- Primary keyword in H1, first 100 words, and H2s
- Meta title: ≤60 chars. Meta description: 120-160 chars.
- One H1 per page. Hierarchical H2 → H3 headings.
- Alt text on all images with keywords
- Internal links: minimum 3 to related content (other AI agents, skills, codex)

### AdSense Rules
- Max 3 ad units per page
- First ad after 3rd paragraph (in-article)
- Second ad in sidebar or between sections
- Third ad after verdict (end of content)
- No ads near interactive elements (buttons, nav)
- 6px minimum padding around all ad units

### Analytics Events
- `view_review` — on page load
- `click_agent_site` — when user clicks "Visit Site" button
- `click_compare` — when user clicks a comparison link
- `read_50_percent` — when user scrolls 50%
- `read_100_percent` — when user reaches bottom

---

## Template — AI Agent Review

### Frontmatter

```yaml
title: "{{ Agent Name }} Review 2026: Features, Pricing & Verdict"
slug: "{{ agent-name }}-review"
category: "review" # or "news"
date: {{ YYYY-MM-DD }}
author: "{{ Author Name }}"
author_bio: "{{ Author Bio with credentials }}"
featured_image: "/images/agents/{{ agent-name }}.jpg"
tags: ["AI Agent", "{{ Category }}", "{{ Use Case }}"]
meta_title: "{{ Agent Name }} Review 2026 — Pricing, Features & Alternatives"
meta_description: "{{ Agent Name }} review 2026. I tested it for {{ X }} days. See pricing, pros/cons, features, and how it compares to {{ Competitor }}."
canonical_url: "https://nexora.com/ai-agent/{{ agent-name }}-review"
```

### Content Structure

```markdown
# {{ Agent Name }} Review 2026: Features, Pricing & Verdict

> **TL;DR:** {{ One-sentence verdict. Who is it for? What's the bottom line? }}

## What is {{ Agent Name }}?
{{ 2-3 paragraph overview. What does it do? Who made it? When was it released? Direct answer in first 2 sentences for AI Overviews. }}

### Key Features
- **{{ Feature 1 }}**: {{ Description }}
- **{{ Feature 2 }}**: {{ Description }}
- **{{ Feature 3 }}**: {{ Description }}

{{ Optional: Include a feature comparison table }}

## Hands-On Testing — What I Found
{{ Detailed review of real usage. Include screenshots. State testing duration. }}
{{ What worked well. What didn't. Specific examples. }}

### Pros
- ✅ {{ Pro 1 }}
- ✅ {{ Pro 2 }}

### Cons
- ❌ {{ Con 1 }}
- ❌ {{ Con 2 }}

## Pricing
| Plan | Price | Key Features |
|------|-------|-------------|
| {{ Free }} | $0 | {{ Features }} |
| {{ Pro }} | ${{ X }}/mo | {{ Features }} |

## {{ Agent Name }} vs {{ Competitor }}
| Feature | {{ Agent }} | {{ Competitor }} |
|---------|-------------|------------------|
| Price | ${{ X }} | ${{ Y }} |
| {{ Feature }} | ✅/❌ | ✅/❌ |

## Verdict — Should You Use It?
{{ Final recommendation. Who it's best for. Who should skip it. }}

**Rating:** ⭐ {{ X }}/5
{{ Use Cases / Best For summary }}
```

---

## Template — AI Agent News

```markdown
# {{ Headline }}

**Published:** {{ Date }} | **Author:** {{ Author Name }}

{{ First paragraph — direct news summary. Who, what, when, where, why in 2-3 sentences. }}

## What Happened
{{ Details of the announcement/release/update. }}

## Why It Matters
{{ Impact analysis. Who it affects. What changed. }}

## {{ Context / Background }}
{{ Related developments. Industry reaction. }}

## What's Next
{{ Expected future developments. }}

---

### Sources
- {{ Source 1 }}: {{ URL }}
- {{ Source 2 }}: {{ URL }}
```

---

## JSON-LD Schema (Copy-Paste)

### Review Schema (for reviews)
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "{{ Agent Name }}",
    "application": "AI Agent",
    "offers": {
      "@type": "Offer",
      "price": "{{ Price }}",
      "priceCurrency": "USD"
    }
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "{{ X }}",
    "bestRating": "5"
  },
  "author": {
    "@type": "Person",
    "name": "{{ Author Name }}"
  },
  "datePublished": "{{ YYYY-MM-DD }}"
}
</script>
```

### NewsArticle Schema (for news)
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "{{ Headline }}",
  "datePublished": "{{ YYYY-MM-DD }}",
  "author": {
    "@type": "Person",
    "name": "{{ Author Name }}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nexora"
  }
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
    { "@type": "ListItem", "position": 2, "name": "AI Agents", "item": "https://nexora.com/ai-agent" },
    { "@type": "ListItem", "position": 3, "name": "{{ Agent Name }} Review" }
  ]
}
</script>
```

---

## Internal Links (Required)

Link to:
1. **Related AI agents**: `{{ /ai-agent/competitor-name-review }}`
2. **Related skill**: `{{ /skills/how-to-use-skill-name }}`
3. **Related codex term**: `{{ /codex/relevant-term }}`
4. **Blog category**: `{{ /blog/category/ai-news }}`

---

## Publishing Checklist

- [ ] Meta title ≤60 chars
- [ ] Meta description 120-160 chars
- [ ] Featured image with alt text
- [ ] Screenshots from real testing (E-E-A-T)
- [ ] Author bio with credentials
- [ ] All external sources cited
- [ ] Internal links to 3+ related pages
- [ ] JSON-LD schema added
- [ ] Ad placements: in-article, sidebar, end
- [ ] SEO slug matches primary keyword
- [ ] Tags added (max 5)
- [ ] Published time set
