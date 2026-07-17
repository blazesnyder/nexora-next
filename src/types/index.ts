export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Author {
  id: string;
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  email: string;
  twitterUrl: string;
  githubUrl: string;
  createdAt: string;
}

export type ContentStatus = 'draft' | 'published' | 'archived';

export interface BaseContent {
  id: string;
  slug: string;
  status: ContentStatus;
  featuredImage: string;
  authorId: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export interface Post extends BaseContent {
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  tags: string[];
  featured: boolean;
  viewCount: number;
  readingTimeMinutes: number;
}

export type AiAgentCategory = 'review' | 'news';

export interface AiAgentPricing {
  plan: string;
  price: string;
  features: string[];
}

export interface AiAgentAlternative {
  name: string;
  slug: string;
}

export interface AiAgent extends BaseContent {
  name: string;
  content: string;
  category: AiAgentCategory;
  description: string;
  rating: number;
  pros: string[];
  cons: string[];
  pricing: AiAgentPricing[];
  websiteUrl: string;
  features: string[];
  alternatives: AiAgentAlternative[];
}

export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Skill extends BaseContent {
  title: string;
  content: string;
  difficulty: SkillDifficulty;
  estimatedTime: string;
  prerequisites: string[];
  toolsNeeded: string[];
  category: string;
  order: number;
}

export interface CodexFaq {
  question: string;
  answer: string;
}

export interface CodexEntry extends BaseContent {
  term: string;
  definition: string;
  content: string;
  category: string;
  relatedTerms: string[];
  faqs: CodexFaq[];
}

export type AdPosition = 'in-article' | 'sidebar' | 'end';
export type AdFormat = 'auto' | 'rectangle' | 'vertical';

export interface AdPlacement {
  position: AdPosition;
  slot: string;
  format: AdFormat;
}

export interface SeoProps {
  title: string;
  description: string;
  canonical: string;
  ogType: string;
  ogImage: string;
  twitterCard: string;
  jsonLd: object;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  youtube?: string;
  linkedin?: string;
}

export interface SiteConfig {
  name: string;
  url: string;
  logo: string;
  description: string;
  socialLinks: SocialLinks;
  adsenseId: string;
  gaId: string;
}
