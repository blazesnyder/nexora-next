# Skill Content Template — Nexora

## Writing Guidelines

### Tone & Style
- **Teaching tone** — clear, patient, actionable. Write as if teaching a friend.
- **Step-by-step** — every step must have a single clear action + expected result.
- **Length**: Tutorials 1000-2000 words. Learning paths 2000-4000 words.
- **Code blocks**: Always specify language. Always show expected output.

### E-E-A-T Requirements (Mandatory)
- Author must have real expertise: _"I've been using {{ Skill/Tool }} for {{ X }} years"_
- Screenshots of actual results (not mockups)
- Link to author's own work/portfolio using this skill
- Cite authoritative sources for technical claims

### SEO Rules
- Primary keyword in H1, intro, H2s
- Meta title formula: `"How to {{ Skill }}: {{ Difficulty }} Tutorial"` or `"Learn {{ Skill }}: Complete Guide"`
- Featured snippet format: first paragraph must directly answer "What is {{ Skill }}?"
- Use numbered lists for steps (Google loves this for featured snippets)
- Internal links: 3+ to related skills, tools, codex terms

### AdSense Rules
- Max 3 ad units per page
- First ad: between prerequisites and first step (in-article)
- Second ad: between major sections
- Third ad: after summary/key takeaways
- No ads inside code blocks or between consecutive steps

### Analytics Events
- `start_tutorial` — user begins reading
- `complete_step_X` — on scroll to each step section
- `complete_tutorial` — user reaches bottom
- `click_external_resource` — user clicks a related tool link
- `copy_code` — user copies a code snippet

---

## Template — Skill Tutorial

### Frontmatter

```yaml
title: "How to {{ Skill Name }}: A Complete {{ Difficulty }} Tutorial"
slug: "how-to-{{ skill-name }}"
difficulty: "Beginner | Intermediate | Advanced"
estimated_time: "{{ X }} minutes"
category: "{{ AI | Gaming | Esports | Tech | Development }}"
date: {{ YYYY-MM-DD }}
author: "{{ Author Name }}"
author_bio: "{{ Credentials relevant to this skill }}"
featured_image: "/images/skills/{{ skill-name }}.jpg"
tags: ["{{ Skill }}", "{{ Tool }}", "{{ Category }}"]
prerequisites: ["{{ Prerequisite 1 }}", "{{ Prerequisite 2 }}"]
tools_needed: ["{{ Tool 1 }}", "{{ Tool 2 }}"]
meta_title: "How to {{ Skill Name }} ({{ Year }}) — {{ Difficulty }} Step-by-Step Guide"
meta_description: "Learn how to {{ skill verb }} in {{ X }} steps. {{ Prerequisites }}? Covered. {{ Difficulty }} tutorial with code examples, screenshots, and best practices."
canonical_url: "https://nexora.com/skills/how-to-{{ skill-name }}"
```

### Content Structure

```markdown
# How to {{ Skill Name }}: A Complete {{ Difficulty }} Tutorial

> **What you'll learn:** {{ 1 sentence summary of what the reader will accomplish. }}
> **Time:** {{ X }} minutes | **Difficulty:** {{ Difficulty }}

## What is {{ Skill Name }}?
{{ 2-3 sentence direct definition — the AI Overview answer. }}
{{ Why this skill matters. Who it's for. }}

## Prerequisites
Before starting, make sure you have:
- ✅ {{ Prerequisite 1 }}
- ✅ {{ Prerequisite 2 }}
- ✅ {{ Tool installed/account created }}

{{ AD IN-ARTICLE: AdUnit after prerequisites }}

## Step 1: {{ First Step Action }}
{{ Clear action verb. }}

```{{ language }}
{{ Code block with expected output comment }}
```

**Expected result:** {{ What the reader should see after this step. }}

## Step 2: {{ Second Step Action }}
{{ Repeat step format. }}

```{{ language }}
{{ Code }}
```

**Expected result:** {{ What they should see. }}

{% if difficulty == "Advanced" %}
## Advanced: {{ Optional deeper dive }}
{{ Extra section for advanced readers. }}
{% endif %}

{{ AD IN-ARTICLE: AdUnit between major sections }}

## Troubleshooting
| Problem | Solution |
|---------|----------|
| {{ Error message }} | {{ Fix }} |
| {{ Error message }} | {{ Fix }} |

## Key Takeaways
- {{ Takeaway 1 }}
- {{ Takeaway 2 }}
- {{ Takeaway 3 }}

## What's Next?
{{ Related skills to learn next. Natural progression path. }}

{{ AD END: AdUnit after content }}
```

---

## Template — Learning Path

```markdown
# Learn {{ Topic }}: Complete Learning Path

> **Level:** {{ Beginner → Advanced }} | **Total time:** {{ X }} hours

{{ Overview of what the reader will achieve by completing this path. }}

## Module 1: {{ Foundation }}
**Time:** {{ X }} minutes

### {{ Skill 1 }}
{{ Brief description }} → [Read full tutorial](/skills/how-to-{{ skill-1 }})

### {{ Skill 2 }}
{{ Brief description }} → [Read full tutorial](/skills/how-to-{{ skill-2 }})

## Module 2: {{ Intermediate }}
**Time:** {{ X }} minutes

### {{ Skill 3 }}
...

## Module 3: {{ Advanced }}
...

## Final Project
{{ Capstone project description. }}
```

---

## JSON-LD Schema (Copy-Paste)

### TechArticle Schema
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "How to {{ Skill Name }}: {{ Difficulty }} Tutorial",
  "description": "{{ Meta description }}",
  "proficiencyLevel": "{{ Difficulty }}",
  "timeRequired": "PT{{ X }}M",
  "dependencies": "{{ Prerequisites as string }}",
  "author": {
    "@type": "Person",
    "name": "{{ Author Name }}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Nexora"
  },
  "datePublished": "{{ YYYY-MM-DD }}"
}
</script>
```

### HowTo Schema (for step-by-step)
```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to {{ Skill Name }}",
  "description": "{{ Meta description }}",
  "totalTime": "PT{{ X }}M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "{{ Step 1 }}",
      "text": "{{ Step 1 instruction }}"
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "{{ Step 2 }}",
      "text": "{{ Step 2 instruction }}"
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
    { "@type": "ListItem", "position": 2, "name": "Skills", "item": "https://nexora.com/skills" },
    { "@type": "ListItem", "position": 3, "name": "How to {{ Skill Name }}" }
  ]
}
</script>
```

---

## Internal Links (Required)

Link to:
1. **Related skill**: `{{ /skills/how-to-related-skill }}`
2. **Related AI agent review**: `{{ /ai-agent/relevant-tool-review }}`
3. **Related codex term**: `{{ /codex/relevant-term }}`
4. **Related blog post**: `{{ /blog/category/topic }}`

---

## Publishing Checklist

- [ ] Meta title ≤60 chars
- [ ] Meta description 120-160 chars
- [ ] Featured image with alt text
- [ ] Difficulty level and time estimate filled
- [ ] All code blocks have language tags
- [ ] Expected result after each step
- [ ] Screenshots from own testing (E-E-A-T)
- [ ] Author bio with relevant credentials
- [ ] Internal links to 3+ related pages
- [ ] JSON-LD schemas added (TechArticle + HowTo)
- [ ] Ad placements at correct positions
- [ ] Prerequisites verified as complete
- [ ] Published time set
