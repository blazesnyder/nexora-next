import Link from "next/link"

export default function SiteLogo({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const nSizes = { sm: "text-[2em]", default: "text-[2.4em]", lg: "text-[3em]" }
  const textSizes = { sm: "text-[1.05em]", default: "text-[1.15em]", lg: "text-[1.4em]" }

  return (
    <Link href="/" className={`relative inline-flex items-center gap-0 ${textSizes[size]}`}>
      <span className={`absolute left-0 top-1/2 -translate-y-1/2 ${nSizes[size]} font-black leading-none tracking-[-0.04em] bg-gradient-to-r from-primary/[0.18] to-primary/[0.07] bg-clip-text text-transparent select-none pointer-events-none whitespace-nowrap`}>
        N E X T
      </span>
      <span className={`${nSizes[size]} font-black leading-none text-red-600`}>
        N
      </span>
      <span className="font-black leading-none tracking-[0.35em] text-primary/80">
        EXORA
      </span>
    </Link>
  )
}
