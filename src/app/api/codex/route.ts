import { NextResponse } from "next/server";

const entries = [
  {
    id: 1,
    term: "Server Component",
    slug: "server-component",
    definition:
      "A React component that runs and renders on the server, reducing client-side JavaScript.",
    category: "React",
    relatedTerms: ["Client Component", "RSC", "SSR"],
    faqs: [
      { q: "Can server components use hooks?", a: "No, hooks require client components." },
    ],
  },
  {
    id: 2,
    term: "Edge Runtime",
    slug: "edge-runtime",
    definition:
      "A lightweight runtime that executes code at the network edge for low-latency responses.",
    category: "Infrastructure",
    relatedTerms: ["Serverless", "CDN", "Middleware"],
    faqs: [
      { q: "What APIs are available in Edge Runtime?", a: "Web standard APIs like Request, Response, and fetch." },
    ],
  },
  {
    id: 3,
    term: "Tree Shaking",
    slug: "tree-shaking",
    definition:
      "A build optimization that removes unused exports from the final bundle.",
    category: "Build Tools",
    relatedTerms: ["Dead Code Elimination", "Bundler", "ES Modules"],
    faqs: [
      { q: "Does tree shaking work with CommonJS?", a: "It works best with ES modules." },
    ],
  },
  {
    id: 4,
    term: "ISR (Incremental Static Regeneration)",
    slug: "isr",
    definition:
      "A Next.js feature that allows static pages to be updated after build without rebuilding the entire site.",
    category: "Next.js",
    relatedTerms: ["SSG", "SSR", "On-Demand Revalidation"],
    faqs: [
      { q: "Can ISR be used with dynamic routes?", a: "Yes, with getStaticPaths and revalidate." },
    ],
  },
  {
    id: 5,
    term: "Middleware",
    slug: "middleware",
    definition:
      "Code that executes before a request is completed, often used for redirects, auth, and headers.",
    category: "Next.js",
    relatedTerms: ["Edge Runtime", "Request", "Response"],
    faqs: [
      { q: "Can middleware read the request body?", a: "No, it only has access to request metadata." },
    ],
  },
  {
    id: 6,
    term: "Web Vitals",
    slug: "web-vitals",
    definition:
      "A set of performance metrics (LCP, FID, CLS) that measure user experience.",
    category: "Performance",
    relatedTerms: ["LCP", "FID", "CLS"],
    faqs: [
      { q: "What is a good LCP score?", a: "Under 2.5 seconds is considered good." },
    ],
  },
  {
    id: 7,
    term: "Tailwind CSS",
    slug: "tailwind-css",
    definition:
      "A utility-first CSS framework for rapidly building custom designs.",
    category: "CSS",
    relatedTerms: ["Utility Classes", "PostCSS", "Design System"],
    faqs: [
      { q: "Can I use Tailwind with component libraries?", a: "Yes, but class conflicts may occur." },
    ],
  },
  {
    id: 8,
    term: "Zustand",
    slug: "zustand",
    definition:
      "A small, fast, and scalable state management library for React.",
    category: "State Management",
    relatedTerms: ["Redux", "Jotai", "Recoil"],
    faqs: [
      { q: "Does Zustand work with Next.js server components?", a: "Zustand stores are client-side only." },
    ],
  },
];

export async function GET() {
  return NextResponse.json(entries);
}
