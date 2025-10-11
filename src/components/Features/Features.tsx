import YoutubePlayer from "../YoutubePlayer/YoutubePlayer";
import type { FeaturesProps } from "./types";

export default function Features({ title, subtitle, items }: FeaturesProps) {
  return (
    <section id="features" className="bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {subtitle ? <p className="mt-2 text-gray-600">{subtitle}</p> : null}

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.title} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="text-lg font-medium">{it.title}</div>
              <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg bg-black">
                <YoutubePlayer videoId={it.youtubeId} showCustomUI={false} />
              </div>
              <p className="mt-2 text-sm text-gray-600">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
