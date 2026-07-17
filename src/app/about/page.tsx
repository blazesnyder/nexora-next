"use client"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Link from "next/link"
import AdBanner from "@/components/ads/AdBanner"

const values = [
  {
    title: "Innovation First",
    description: "We chase the bleeding edge of technology and gaming, bringing you insights before they hit the mainstream.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "Community Driven",
    description: "Our readers shape our content. We listen, engage, and build content that sparks conversation.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Quality Over Speed",
    description: "We prioritize depth and accuracy over click-driven content. Every article is thoroughly researched.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Transparency",
    description: "Clear sourcing, honest reviews, and no hidden agendas. What you see is what we believe.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

const stats = [
  { label: "Articles Published", value: "100+", suffix: "" },
  { label: "Categories", value: "4", suffix: "" },
  { label: "Monthly Readers", value: "10", suffix: "K+" },
  { label: "Topics Covered", value: "12", suffix: "+" },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-4 md:px-8 text-center">
            <p className="text-accent text-xs font-semibold uppercase mb-4">About Us</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">About Nexora</h1>
            <p className="text-white/70 leading-relaxed max-w-2xl mx-auto">
              Your destination for cutting-edge content spanning AI, gaming, esports, and technology.
            </p>
          </div>
        </section>

        <AdBanner format="leaderboard" className="my-12" />

        {/* Our Mission */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <div className="text-center mb-10">
              <p className="text-accent text-xs font-semibold uppercase mb-2">Mission</p>
              <h2 className="text-2xl font-bold text-white mb-8">Our Mission</h2>
            </div>
            <p className="text-white/70 leading-relaxed max-w-3xl mx-auto">
                Nexora is your ultimate destination for cutting-edge content spanning artificial intelligence,
                gaming, esports, and technology. We strive to deliver insightful analysis, breaking news, and
                in-depth guides that empower our readers to stay ahead in a rapidly evolving digital world.
                Our mission is to build a community of curious minds who share a passion for innovation and play.
              </p>
          </div>
        </section>

        <div className="border-t border-white/10 my-20" />

        {/* Stats */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="text-center mb-12">
              <p className="text-accent text-xs font-semibold uppercase mb-2">Impact</p>
              <h2 className="text-2xl font-bold text-white mb-8">By the Numbers</h2>
              <p className="mt-2 text-white/70">Our reach and impact in the community</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-white">
                    {stat.value}{stat.suffix}
                  </div>
                  <p className="mt-2 text-white/40 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-white/10 my-20" />

        {/* Our Values */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <div className="text-center mb-12">
              <p className="text-accent text-xs font-semibold uppercase mb-2">Values</p>
              <h2 className="text-2xl font-bold text-white mb-8">Our Values</h2>
              <p className="mt-2 text-white/70">What drives us every day</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {values.map((value) => (
                <div key={value.title}>
                  <div className="text-white/40 mb-3">
                    {value.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="border-t border-white/10 my-20" />

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-8 text-center">
            <p className="text-accent text-xs font-semibold uppercase mb-2">Connect</p>
            <h2 className="text-2xl font-bold text-white mb-8">Want to get in touch?</h2>
            <p className="text-white/70 leading-relaxed mb-8 max-w-lg mx-auto">
              Have a tip, question, or collaboration idea? We would love to hear from you.
            </p>
            <Link
              href="/contact"
              className="text-accent hover:text-white transition-colors font-medium"
            >
              Contact Us &rarr;
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  )
}
