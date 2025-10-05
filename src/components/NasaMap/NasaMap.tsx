import { useState } from "react";
import type { MapProps } from "./types";
import { LAYERS_DATES } from "../../utils";
import { MapPicker } from "./MapPicker/MapPicker";
import type { LatLngLiteral } from "leaflet";
import { getLayersData } from "./utils";

export default function NasaMap({
  labels,
  initialDate,
}: MapProps) {
  const [picked, setPicked] = useState<LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateTuple, setDateTuple] = useState<[string, string]>(
    initialDate ? (initialDate.split("-") as [string, string]) : ["2000", "2003"]
  );
  const date = `${dateTuple[0]}-${dateTuple[1]}`;

  return (
    <div className="rounded-2xl border p-6 shadow-sm">

      {
        loading ? (
          <div className="aspect-video text-lg rounded-xl  bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-sm text-gray-900">
            <div>Loading...</div>
          </div>
        ) : null
      }

      {
        !loading ? (
          <>
            {/* Preview area */}
            <div className="aspect-video rounded-xl  bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-sm text-gray-500">
              <MapPicker
                height="100%"
                onSelect={(coord) => {
                  setPicked(coord);
                }}
              />
            </div>

            {/* Controls */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">

              <label className="flex flex-col text-sm">
                <span className="mb-1 text-gray-700">{labels.dateLabel}</span>

                <select
                  className="rounded-lg border px-3 py-2"
                  value={date}
                  onChange={(e) => setDateTuple(e.target.value.split("-") as [string, string])}
                >
                  {LAYERS_DATES.map(([start, end]) => (
                    <option key={`${start}-${end}`} value={`${start}-${end}`}>
                      {start} - {end}
                    </option>
                  ))}
                </select>

              </label>

              <div className="flex items-end">
                <button
                  className="w-full rounded-lg border px-3 py-2 font-medium bg-gray-700 text-white hover:bg-gray-600 hover:cursor-pointer active:translate-y-px"
                  onClick={() =>
                    getLayersData(dateTuple, picked, setLoading)
                  }
                >
                  {labels.load}
                </button>
              </div>
            </div>
          </>
        ) : null
      }

    </div>
  );
}
