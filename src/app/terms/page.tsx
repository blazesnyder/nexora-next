import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Terms of Service - Nexora",
  description: "Nexora's terms of service governing the use of our website and content.",
}

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1 py-16 md:py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <span className="text-accent text-xs font-semibold uppercase">Legal</span>
            <h1 className="mt-4 text-3xl md:text-4xl font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-white/60 text-sm">Last updated: January 1, 2026</p>
          </div>

          <div>
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Use of Service</h2>
              <p className="text-white/70 leading-relaxed">
                By accessing or using Nexora, you agree to be bound by these Terms of Service. If you do not
                agree with any part of these terms, you must not use our website. We reserve the right to
                update or modify these terms at any time without prior notice.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
              <p className="text-white/70 leading-relaxed mb-4">As a user of Nexora, you agree to:</p>
              <ul className="list-disc pl-6 text-white/60 space-y-2">
                <li>Use the website in compliance with all applicable laws and regulations</li>
                <li>Not engage in any activity that disrupts or interferes with the website</li>
                <li>Not attempt to gain unauthorized access to any part of the website</li>
                <li>Not reproduce, distribute, or create derivative works of our content without permission</li>
                <li>Not use the website for any fraudulent or unlawful purpose</li>
              </ul>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p className="text-white/70 leading-relaxed">
                All content published on Nexora, including but not limited to articles, graphics, logos,
                images, and code, is the intellectual property of Nexora unless otherwise stated. You may not
                reproduce, distribute, modify, or republish any content without our prior written consent.
                Unauthorized use of our content may violate copyright, trademark, and other laws.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Disclaimer</h2>
              <p className="text-white/70 leading-relaxed">
                Nexora provides content for informational and entertainment purposes only. We make no
                representations or warranties of any kind, express or implied, regarding the accuracy,
                completeness, or reliability of the information presented. Your use of the website is at
                your own risk.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-white/70 leading-relaxed">
                In no event shall Nexora or its owners be liable for any direct, indirect, incidental,
                consequential, or punitive damages arising out of your access to, use of, or inability to
                use the website. This limitation applies even if we have been advised of the possibility
                of such damages.
              </p>
            </section>

            <div className="border-t border-white/10 my-16" />

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p className="text-white/70 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us through our{" "}
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
