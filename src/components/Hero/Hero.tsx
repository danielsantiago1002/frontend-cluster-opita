import type { HeroProps } from "./types";

export default function Hero({
  title,
  desc,
  primary,
  secondary,
}: HeroProps) {
  return (
      <div>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold">{title}</h1>
        <p className="mt-4 text-gray-600 max-w-prose">{desc}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="#features"
            className="px-5 py-3 rounded-xl bg-gray-900 text-white text-center"
          >
            {primary}
          </a>
          <a
            href="#features"
            className="px-5 py-3 rounded-xl border text-center"
          >
            {secondary}
          </a>
        </div>
      </div>
  );
}