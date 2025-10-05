import type { HeroProps } from "./types";

export default function Hero({
  title,
  desc,
}: HeroProps) {
  return (
      <div>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold">{title}</h1>
        <p className="mt-4 text-gray-600 max-w-prose text-xl">{desc}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
        </div>
      </div>
  );
}