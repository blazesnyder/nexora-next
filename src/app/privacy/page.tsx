import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Privacy Policy - Nexora",
  description: "Nexora's privacy policy outlining how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-accent text-xs font-semibold uppercase">Privacy</span>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-white/60 text-sm">Last updated: January 1, 2026</p>
          </div>

          <div>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="text-white/70 leading-relaxed">
                When you visit Nexora, we may collect certain information automatically, including your IP
                address, browser type, operating system, referring URLs, and browsing behavior on our site.
                If you contact us via our contact form, we collect your name, email address, and any additional
                information you choose to provide.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-white/60 space-y-2">
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our content</li>
                <li>Respond to your comments, questions, and inquiries</li>
                <li>Analyze usage patterns and trends</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Nexora uses cookies and similar tracking technologies to enhance your browsing experience.
                Cookies are small text files stored on your device that help us remember your preferences and
                understand how you interact with our site.
              </p>
              <p className="text-white/60 leading-relaxed mb-4">
                We use Google AdSense to display advertisements. AdSense uses cookies to serve personalized
                ads based on your previous visits to our website and other sites across the internet. You can
                opt out of personalized advertising by visiting Google&apos;s Ads Settings.
              </p>
              <p className="text-white/60 leading-relaxed">
                We also use Google Analytics to collect anonymized data about site traffic and usage patterns.
                This helps us understand what content resonates with our audience and improve our site. Google
                Analytics uses its own cookies. You can learn more about how Google handles data at
                Google&apos;s Privacy & Terms site.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
              <p className="text-white/70 leading-relaxed mb-4">
                Nexora may use third-party services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-white/60 space-y-2">
                <li>Google AdSense &mdash; for advertising</li>
                <li>Google Analytics &mdash; for traffic analysis</li>
                <li>Cloud hosting providers &mdash; for website infrastructure</li>
              </ul>
              <p className="text-white/60 leading-relaxed mt-4">
                These third parties have their own privacy policies governing the use of your information.
                We encourage you to review their policies.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Protection</h2>
              <p className="text-white/70 leading-relaxed">
                We implement reasonable security measures to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the Internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p className="text-white/70 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us through our{" "}
                <a href="/contact" className="text-accent hover:text-white transition-colors font-medium">
                  contact page
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
