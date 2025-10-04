import { useState } from "react";
import type { MapProps } from "./types";

const handleLoadCallback = ({ layerId, date }: { layerId: string; date: string }) => {
  // TODO: Replace with real GIBS fetch/rendering
  console.log("Load requested:", { layerId, date });
};

export default function NasaMap({
  layers,
  labels,
  initialLayerId,
  initialDate,
}: MapProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [layerId, setLayerId] = useState<string>(initialLayerId ?? layers[0]?.id ?? "");
  const [date, setDate] = useState<string>(initialDate ?? today);

  const handleLoad = () => {
    handleLoadCallback?.({ layerId, date });
    // Temporary demo feedback:
    if (!handleLoadCallback) {
      alert(`${labels.load}: ${layerId} @ ${date}`);
    }
  };

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      {/* Preview area */}
      <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-sm text-gray-500">
        {labels.mapPlaceholder}
      </div>

      {/* Controls */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col text-sm">
          <span className="mb-1 text-gray-700">{labels.layerLabel}</span>
          <select
            className="rounded-lg border px-3 py-2"
            value={layerId}
            onChange={(e) => setLayerId(e.target.value)}
          >
            {layers.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-gray-700">{labels.dateLabel}</span>
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
            onClick={handleLoad}
          >
            {labels.load}
          </button>
        </div>
      </div>
    </div>
  );
}
