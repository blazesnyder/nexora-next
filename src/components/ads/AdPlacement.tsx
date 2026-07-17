export default function AdPlacement({
  format = "leaderboard",
  className = "",
}: {
  format?: "leaderboard" | "rectangle" | "skyscraper"
  className?: string
}) {
  const sizes = {
    leaderboard: "w-full max-w-[728px] h-[90px]",
    rectangle: "w-full max-w-[300px] h-[250px]",
    skyscraper: "w-full max-w-[160px] h-[600px]",
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[format]} bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1`}>
        <span className="text-[10px] text-white/20 font-medium uppercase tracking-[0.2em]">Advertisement</span>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m0 0V5.625m0 0a1.125 1.125 0 011.125-1.125h7.5c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 00-1.125 1.125v3.375m0 0a1.125 1.125 0 01-1.125 1.125H5.625a1.125 1.125 0 01-1.125-1.125v-3.375" />
          </svg>
          <span className="text-[10px] text-white/15 font-mono">Ad Space</span>
        </div>
      </div>
    </div>
  )
}
