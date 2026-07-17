import Link from "next/link";

const footerLinks = {
  categories: [
    { href: "/category/ai", label: "AI" },
    { href: "/category/gaming", label: "Gaming" },
    { href: "/category/esports", label: "Esports" },
    { href: "/category/tech", label: "Tech" },
  ],
  resources: [
    { href: "/codex", label: "Codex" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  social: [
    { href: "https://twitter.com/nexora", label: "Twitter", external: true },
    { href: "https://github.com/nexora", label: "GitHub", external: true },
    { href: "https://discord.gg/nexora", label: "Discord", external: true },
    { href: "https://linkedin.com/company/nexora", label: "LinkedIn", external: true },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary" aria-label="Nexora Home">
              <span className="text-accent font-mono text-2xl">N</span>
              <span>Nexora</span>
            </Link>
            <p className="mt-4 text-sm text-secondary leading-relaxed">
              Your daily source for AI, gaming, esports, and tech news. In-depth reviews, tutorials, and a comprehensive codex of tech terms.
            </p>
          </div>

          <nav aria-label="Categories">
            <h3 className="font-semibold text-primary mb-4">Categories</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <h3 className="font-semibold text-primary mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Social">
            <h3 className="font-semibold text-primary mb-4">Connect</h3>
            <ul className="space-y-3">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {link.label}
                    {link.external && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-line">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted">
              &copy; {currentYear} Nexora. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted">
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}