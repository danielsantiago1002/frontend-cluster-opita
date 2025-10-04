import { useEffect, useState } from "react";

type Lang = "en" | "es";
type Theme = "light" | "dark";

const TEXT: Record<
  Lang,
  {
    brand: string;
    navFeatures: string;
    badge: string;
    title: string;
    desc: string;
    primary: string;
    secondary: string;
    featuresTitle: string;
    featuresSubtitle: string;
    features: { title: string; body: string }[];
    mapPlaceholder: string;
  }
> = {
  en: {
    brand: "Orbital Maps",
    navFeatures: "Features",
    badge: "NASA • Simple starter",
    title: "Analyze NASA maps in minutes",
    desc:
      "A minimal React + Tailwind starter focused on NASA Earth data (GIBS). Load layers, set dates, and preview map tiles quickly.",
    primary: "Try a preview",
    secondary: "See features",
    featuresTitle: "Features",
    featuresSubtitle: "Essentials to explore NASA map layers.",
    features: [
      { title: "GIBS Layers", body: "Plug in imagery like MODIS, VIIRS, and more." },
      { title: "Time Controls", body: "Switch dates to compare changes over time." },
      { title: "Light/Dark UI", body: "Accessible theme toggle with persistence." },
    ],
    mapPlaceholder: "Map preview / NASA GIBS tile here",
  },
  es: {
    brand: "Mapas Orbitales",
    navFeatures: "Características",
    badge: "NASA • Starter simple",
    title: "Analiza mapas de la NASA en minutos",
    desc:
      "Starter mínimo con React + Tailwind enfocado en datos de la Tierra (GIBS). Carga capas, define fechas y previsualiza mosaicos rápidamente.",
    primary: "Probar vista previa",
    secondary: "Ver características",
    featuresTitle: "Características",
    featuresSubtitle: "Esenciales para explorar capas de mapas de la NASA.",
    features: [
      { title: "Capas GIBS", body: "Conecta imágenes como MODIS, VIIRS y más." },
      { title: "Control de tiempo", body: "Cambia fechas para comparar cambios." },
      { title: "Tema claro/oscuro", body: "Toggle accesible con persistencia." },
    ],
    mapPlaceholder: "Vista previa del mapa / mosaico GIBS aquí",
  },
};

function useTheme(): [Theme, () => void] {
  // Initialize from localStorage or OS preference
  const getInitial = (): Theme => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setTheme] = useState<Theme>(getInitial);

  // Apply theme class to <html> (prevents flicker on toggle + on mount)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const t = TEXT[lang];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200/70 dark:border-gray-800/80 bg-white/70 dark:bg-gray-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between h-16 gap-3">
            <a href="#" className="font-semibold text-lg">
              {t.brand}
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-6 text-sm">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {t.navFeatures}
              </a>
            </nav>

            {/* Desktop controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm"
                onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
                aria-label="Toggle language"
                title="Toggle language"
              >
                {lang === "en" ? "ES" : "EN"}
              </button>
              <button
                className="inline-flex items-center rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {theme === "dark" ? (
                  // Sun icon (switch to light)
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="currentColor" className="w-5 h-5">
                    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                    <path d="M12 1a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1Zm0 20a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm11-9a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM3 12a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Z" />
                  </svg>
                ) : (
                  // Moon icon (switch to dark)
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                       fill="currentColor" className="w-5 h-5">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
                  </svg>
                )}
              </button>
              <button
                className="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                     fill="currentColor" className="w-5 h-5">
                  <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
            </div>

            {/* Mobile menu button (visible on mobile) */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg border px-3 py-2"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                   fill="currentColor" className="w-5 h-5">
                <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col gap-2">
                <a
                  href="#features"
                  className="rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.navFeatures}
                </a>
                <div className="flex gap-2">
                  <button
                    className="rounded-lg border px-3 py-2 flex-1"
                    onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
                  >
                    {lang === "en" ? "ES" : "EN"}
                  </button>
                  <button
                    className="rounded-lg border px-3 py-2 flex-1"
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? "Light" : "Dark"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid md:grid-cols-2 items-center gap-10">
            <div>
              <span className="inline-block rounded-full border border-gray-300 dark:border-gray-700 px-3 py-1 text-xs text-gray-600 dark:text-gray-300">
                {t.badge}
              </span>
              <h1 className="mt-4 text-4xl/tight md:text-5xl font-bold">{t.title}</h1>
              <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-prose">
                {t.desc}
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl bg-gray-900 dark:bg-white px-5 py-3 text-white dark:text-gray-900"
                >
                  {t.primary}
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 px-5 py-3"
                >
                  {t.secondary}
                </a>
              </div>
            </div>

            {/* Map mock box */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
              <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 grid place-items-center text-sm text-gray-500 dark:text-gray-400">
                {t.mapPlaceholder}
              </div>
              {/* Minimal controls to hint map settings */}
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <select className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm">
                  <option>MODIS_Terra_CorrectedReflectance_TrueColor</option>
                  <option>VIIRS_SNPP_CorrectedReflectance_TrueColor</option>
                  <option>MODIS_Terra_Land_Surface_Temp_Day</option>
                </select>
                <input
                  type="date"
                  className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                />
                <button className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm">
                  Load
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-2xl font-semibold">{t.featuresTitle}</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{t.featuresSubtitle}</p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {t.features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 shadow-sm"
              >
                <div className="text-lg font-medium">{f.title}</div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>© {new Date().getFullYear()} {t.brand}</span>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-2 py-1"
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
            >
              {lang === "en" ? "ES" : "EN"}
            </button>
            <button
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-2 py-1"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}