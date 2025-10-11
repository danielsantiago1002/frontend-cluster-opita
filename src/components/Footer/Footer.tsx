import type { FooterProps } from "./types";

export default function Footer({ brand, year = new Date().getFullYear(), lang, onToggleLang }: FooterProps) {
  return (
    <footer className="mt-auto border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-gray-500">
        <span>© {year} {brand}</span>
        <button
          className="rounded-lg border px-2 py-1"
          onClick={onToggleLang}
        >
          {lang === "en" ? "ES" : "EN"}
        </button>
      </div>
    </footer>
  );
}
