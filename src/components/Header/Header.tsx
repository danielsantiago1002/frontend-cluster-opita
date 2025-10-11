import type { HeaderProps } from "./types";
import adaLogo from "../../assets/ada_logo.svg"; // adjust path if needed

export default function Header({ brand, lang, onToggleLang }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 flex justify-between items-center h-16">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2">
          <img
            src={adaLogo}
            alt={`${brand} logo`}
            className="h-8 w-auto"
          />
          <span className="font-semibold text-lg">{brand}</span>
        </div>

        {/* Language toggle */}
        <button
          className="rounded-lg border px-3 py-2 text-sm"
          onClick={onToggleLang}
        >
          {lang === "en" ? "ES" : "EN"}
        </button>
      </div>
    </header>
  );
}