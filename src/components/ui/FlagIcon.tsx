const countryCodes: Record<string, string> = {
  en: "us",
  es: "es",
  fr: "fr",
  de: "de",
  ja: "jp",
  ko: "kr",
  zh: "cn",
  pt: "pt",
  ru: "ru",
  ar: "sa",
}

export default function FlagIcon({ code }: { code: string }) {
  const cc = countryCodes[code]
  if (!cc) return null
  return (
    <img
      src={`https://flagcdn.com/${cc}.svg`}
      alt=""
      className="inline-block w-[18px] h-[12px] rounded-[2px] object-cover flex-shrink-0"
    />
  )
}
