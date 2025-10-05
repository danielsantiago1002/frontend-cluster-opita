import TerraModelViewer from "./TerraModelViewer";
import type { TerraSectionProps } from "./types";

export default function TerraSection({ copy }: TerraSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
      {/* Text */}
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-extrabold">{copy.heading}</h2>
        <p className="text-gray-700">{copy.body1}</p>
        <p className="text-gray-700">{copy.body2}</p>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">{copy.instrumentsTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {copy.instruments.map((instrument, index) => (
              <div 
                key={instrument} 
                className={`p-4 bg-white rounded-lg border ${
                  index === copy.instruments.length - 1 && copy.instruments.length % 2 === 1 
                    ? 'md:col-span-2 md:max-w-md md:mx-auto' 
                    : ''
                }`}
              >
                <h4 className="font-semibold text-sm">{instrument.split(' — ')[0]}</h4>
                <p className="text-xs text-gray-600 mt-1">{instrument.split(' — ')[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D */}
      <div id="terra-3d" className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <TerraModelViewer src="/terra.glb" height={460} background="transparent" />
        <div className="px-4 py-2 text-xs text-gray-500 border-t">
          Click & drag to rotate • Wheel/pinch to zoom
        </div>
      </div>
    </section>
  );
}
