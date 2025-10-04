import { useState } from "react";

type Lang = "en" | "es";

const TEXT = {
  en: {
    brand: "Orbital Maps",
    badge: "NASA • Simple starter",
    title: "Analyze NASA maps in minutes",
    desc:
      "Minimal React + Tailwind starter for exploring NASA Earth data (GIBS). Choose a layer, set a date, and preview tiles.",
    primary: "Preview a layer",
    secondary: "See features",
    navFeatures: "Features",
    mapPlaceholder: "NASA GIBS map preview here",
    featuresTitle: "Features",
    featuresSubtitle: "Essentials for exploring NASA layers.",
    features: [
      { title: "GIBS Layers", body: "Load MODIS, VIIRS, Blue Marble, and more." },
      { title: "Time Controls", body: "Switch dates to spot changes over time." },
      { title: "Simple UI", body: "Clean light theme without complexity." },
    ],
    layerLabel: "Layer",
    dateLabel: "Date",
    load: "Load",
  },
  es: {
    brand: "Mapas Orbitales",
    badge: "NASA • Starter simple",
    title: "Analiza mapas de la NASA en minutos",
    desc:
      "Starter mínimo con React + Tailwind para explorar datos de la Tierra (GIBS). Elige una capa, define fecha y previsualiza mosaicos.",
    primary: "Previsualizar capa",
    secondary: "Ver características",
    navFeatures: "Características",
    mapPlaceholder: "Vista previa del mapa GIBS aquí",
    featuresTitle: "Características",
    featuresSubtitle: "Esenciales para explorar capas de la NASA.",
    features: [
      { title: "Capas GIBS", body: "Carga MODIS, VIIRS, Blue Marble y más." },
      { title: "Tiempo", body: "Cambia fechas para ver variaciones." },
      { title: "UI simple", body: "Tema claro sin complejidad extra." },
    ],
    layerLabel: "Capa",
    dateLabel: "Fecha",
    load: "Cargar",
  },
} as const;

const LAYERS = [
  { id: "MODIS_Terra_CorrectedReflectance_TrueColor", label: "MODIS Terra TrueColor" },
  { id: "VIIRS_SNPP_CorrectedReflectance_TrueColor", label: "VIIRS SNPP TrueColor" },
  { id: "MODIS_Terra_Land_Surface_Temp_Day", label: "MODIS Terra LST Day" },
];

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const t = TEXT[lang];

  const [layer, setLayer] = useState(LAYERS[0].id);
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));

  // Stub action for the Load button (replace with real fetch later)
  const onLoad = () => {
    console.log("Load requested:", { layer, date });
    alert(`${t.load}: ${layer} @ ${date}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 flex justify-between items-center h-16">
          <span className="font-semibold text-lg">{t.brand}</span>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              {t.navFeatures}
            </a>
          </nav>
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block rounded-full border px-3 py-1 text-xs text-gray-600">
            {t.badge}
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold">{t.title}</h1>
          <p className="mt-4 text-gray-600 max-w-prose">{t.desc}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="#features"
              className="px-5 py-3 rounded-xl bg-gray-900 text-white text-center"
            >
              {t.primary}
            </a>
            <a
              href="#features"
              className="px-5 py-3 rounded-xl border text-center"
            >
              {t.secondary}
            </a>
          </div>
        </div>

        {/* Map mock with controls */}
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-sm text-gray-500">
            {t.mapPlaceholder}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col text-sm">
              <span className="mb-1 text-gray-700">{t.layerLabel}</span>
              <select
                className="rounded-lg border px-3 py-2"
                value={layer}
                onChange={(e) => setLayer(e.target.value)}
              >
                {LAYERS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col text-sm">
              <span className="mb-1 text-gray-700">{t.dateLabel}</span>
              <input
                type="date"
                className="rounded-lg border px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <div className="flex items-end">
              <button
                className="w-full rounded-lg border px-3 py-2 font-medium hover:bg-gray-50 active:translate-y-px"
                onClick={onLoad}
              >
                {t.load}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-2xl font-semibold">{t.featuresTitle}</h2>
          <p className="mt-2 text-gray-600">{t.featuresSubtitle}</p>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {t.features.map((f) => (
              <div key={f.title} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="text-lg font-medium">{f.title}</div>
                <p className="mt-2 text-sm text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-gray-500">
          <span>© {new Date().getFullYear()} {t.brand}</span>
          <button
            className="rounded-lg border px-2 py-1"
            onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
          >
            {lang === "en" ? "ES" : "EN"}
          </button>
        </div>
      </footer>
    </div>
  );
}
