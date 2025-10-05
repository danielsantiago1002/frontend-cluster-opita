import { useState } from "react";
import NasaMap from "./components/NasaMap/NasaMap";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import Footer from "./components/Footer/Footer";
import type { Lang } from "./types";
import { LAYERS, TEXT } from "./utils";

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const t = TEXT[lang];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      <Header
        brand={t.brand}
        navFeatures={t.navFeatures}
        lang={lang}
        onToggleLang={() => setLang(lang === "en" ? "es" : "en")}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-2 gap-10 items-center">
        <Hero
          title={t.title}
          desc={t.desc}
          primary={t.primary}
          secondary={t.secondary}
        />
        <NasaMap
          layers={LAYERS}
          labels={t.mapLabels}
        />
      </section>

      <Features
        title={t.featuresTitle}
        subtitle={t.featuresSubtitle}
        items={t.features}
      />

      <Footer
        brand={t.brand}
        lang={lang}
        onToggleLang={() => setLang(lang === "en" ? "es" : "en")}
      />
    </div>
  );
}