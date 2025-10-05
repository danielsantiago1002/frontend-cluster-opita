import { useState } from "react";
import type { MapProps } from "./types";
import { LAYERS_DATES } from "../../utils";
import { MapPicker } from "./MapPicker/MapPicker";
import type { LatLngLiteral } from "leaflet";
import { getLayersData, labelFor } from "./utils";

// --- NEW: Mediabunny imports & helpers (all local in this file for convenience) ---
import {
  Output,
  Mp4OutputFormat,
  BufferTarget,
  CanvasSource,
  QUALITY_HIGH,
} from "mediabunny";

// ---------- Legend mapping (add more when available) ----------
const LEGENDS: Record<string, string> = {
  // Your provided MOPITT legend (serve from /public/legends/)
  "MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day": "/legends/mopitt_co.png",
  "MODIS_Terra_L3_NDVI_Monthly": "/legends/modis_veg.png",
  "MODIS_Terra_NDSI_Snow_Cover": "/legends/modis_snow.png",
};

// ---------- Minimal drawing helpers ----------
const createCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
};

function drawContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  x: number, y: number, w: number, h: number
) {
  const iw = (img as any).width as number;
  const ih = (img as any).height as number;
  const s = Math.min(w / iw, h / ih);
  const dw = iw * s, dh = ih * s;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

async function loadImageAny(src: Blob | string): Promise<{ img: HTMLImageElement; urlToRevoke?: string }> {
  if (typeof src === "string") {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.src = src;
    await img.decode();
    return { img };
  }
  const url = URL.createObjectURL(src);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  return { img, urlToRevoke: url };
}

async function makeIntroCanvas(
  title = "A.D.A",
  subtitle = "(Astronomical Data Animator)",
  w = 1920,
  h = 1080
) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#111"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.font = "900 120px system-ui";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(title, w / 2, h * 0.42);
  ctx.font = "500 48px system-ui";
  ctx.fillText(subtitle, w / 2, h * 0.55);
  return canvas;
}

async function makeLayerTitleCanvas(layerName: string, w = 1920, h = 1080) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#111"; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#2a2a2a"; ctx.fillRect(0, h * 0.5, w, 4);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = "700 60px system-ui"; ctx.fillText("Layer", w / 2, h * 0.36);
  ctx.font = "800 72px system-ui"; ctx.fillText(layerName, w / 2, h * 0.6);
  return canvas;
}

// ---------- Types shared with your utils ----------
export type AdaFrame = {
  blob: Blob;
  date: string;        // "YYYY-MM-DD"
  layerGroup: string;  // e.g., "MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day"
};

// ---------- Build main video (with per-frame legend) ----------
async function buildAdaVideoFromFrames(params: {
  items: AdaFrame[];
  legends?: Record<string, string | Blob>;
  width?: number; height?: number;
  fps?: number;
  frameDurationSec?: number;
  cardDurationSec?: number;
  introDurationSec?: number;
}): Promise<Blob> {
  const {
    items,
    legends = {},
    width = 1920,
    height = 1080,
    fps = 24,
    frameDurationSec = 0.25,
    cardDurationSec = 1.5,
    introDurationSec = 2.5,
  } = params;

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
  const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d")!;
  const video = new CanvasSource(canvas, { codec: "avc", bitrate: QUALITY_HIGH });
  output.addVideoTrack(video, { frameRate: fps });
  await output.start();

  let t = 0;

  // Intro
  const intro = await makeIntroCanvas("A.D.A", "(Astronomical Data Animator)", width, height);
  ctx.drawImage(intro, 0, 0, width, height);
  await video.add(t, introDurationSec);
  t += introDurationSec;

  const footerH = 140;
  const contentH = height - footerH;

  const uniqueLayers = [...new Set(sorted.map(s => s.layerGroup))];
  for (const layer of uniqueLayers) {
    const subset = sorted.filter(s => s.layerGroup === layer);

    // Title card
    const titleCard = await makeLayerTitleCanvas(layer, width, height);
    ctx.drawImage(titleCard, 0, 0, width, height);
    await video.add(t, cardDurationSec);
    t += cardDurationSec;

    // Preload legend (if any)
    const legendSrc = legends[layer];
    const legend = legendSrc ? await loadImageAny(legendSrc) : undefined;

    for (const item of subset) {
      const frame = await loadImageAny(item.blob);

      // bg + main image
      ctx.fillStyle = "#111"; ctx.fillRect(0, 0, width, height);
      drawContain(ctx, frame.img, 0, 0, width, contentH);

      // footer
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(0, height - footerH, width, footerH);

      // left: text
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.font = "600 40px system-ui";
      ctx.fillText(labelFor(item.layerGroup), 32, height - 88);
      ctx.font = "500 36px system-ui";
      ctx.fillText(item.date, 32, height - 36);

      // center: legend
      if (legend?.img) {
        const maxW = width * 0.6, maxH = 72;
        const iw = legend.img.width, ih = legend.img.height;
        const s = Math.min(maxW / iw, maxH / ih);
        const dw = iw * s, dh = ih * s;
        const dx = (width - dw) / 2;
        const dy = height - footerH + (footerH - dh) / 2;
        ctx.drawImage(legend.img, dx, dy, dw, dh);
      }

      // right: tag
      ctx.textAlign = "right";
      ctx.font = "600 28px system-ui";
      ctx.fillText("A.D.A", width - 32, height - 40);

      await video.add(t, frameDurationSec);
      t += frameDurationSec;

      if (frame.urlToRevoke) URL.revokeObjectURL(frame.urlToRevoke);
    }

    if (legend?.urlToRevoke) URL.revokeObjectURL(legend.urlToRevoke);
  }

  await output.finalize();
  //@ts-ignore
  return new Blob([output.target.buffer], { type: output.format.mimeType });
}

// ---------- Build Snow vs NDVI split video (with per-panel legend) ----------
async function buildSideBySideSnowVsNdvi(params: {
  items: AdaFrame[];
  legends?: Record<string, string | Blob>;
  width?: number; height?: number;
  fps?: number; frameDurationSec?: number;
}): Promise<Blob> {
  const {
    items,
    legends = {},
    width = 1920,
    height = 1080,
    fps = 24,
    frameDurationSec = 0.35,
  } = params;

  const SNOW = "MODIS_Terra_NDSI_Snow_Cover";
  const NDVI = "MODIS_Terra_L3_NDVI_Monthly";

  const snow = new Map(items.filter(i => i.layerGroup === SNOW).map(i => [i.date, i.blob] as const));
  const ndvi = new Map(items.filter(i => i.layerGroup === NDVI).map(i => [i.date, i.blob] as const));
  const dates = [...snow.keys()].filter(d => ndvi.has(d)).sort();

  const output = new Output({ format: new Mp4OutputFormat(), target: new BufferTarget() });
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d")!;
  const video = new CanvasSource(canvas, { codec: "avc", bitrate: QUALITY_HIGH });
  output.addVideoTrack(video, { frameRate: fps });
  await output.start();

  // Preload legends
  const snowLegend = legends[SNOW] ? await loadImageAny(legends[SNOW]!) : undefined;
  const ndviLegend = legends[NDVI] ? await loadImageAny(legends[NDVI]!) : undefined;

  // Title
  const title = await makeLayerTitleCanvas("Snow vs NDVI", width, height);
  ctx.drawImage(title, 0, 0, width, height);
  await video.add(0, 2.0);

  let t = 2.0;

  const gutter = 16, headerH = 60, footerH = 140;
  const panelH = height - headerH - footerH - gutter * 2;
  const panelW = (width - gutter * 3) / 2;
  const leftX = gutter, rightX = gutter * 2 + panelW, topY = headerH + gutter;

  for (const date of dates) {
    const L = await loadImageAny(snow.get(date)!);
    const R = await loadImageAny(ndvi.get(date)!);

    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, width, height);

    // headers
    ctx.fillStyle = "#fff"; ctx.font = "700 38px system-ui";
    ctx.textAlign = "left"; ctx.fillText("MODIS Snow (NDSI)", leftX, 42);
    ctx.textAlign = "right"; ctx.fillText("MODIS NDVI", width - gutter, 42);

    // panels
    ctx.fillStyle = "#1c1c1c";
    ctx.fillRect(leftX, topY, panelW, panelH);
    ctx.fillRect(rightX, topY, panelW, panelH);

    drawContain(ctx, L.img, leftX, topY, panelW, panelH);
    drawContain(ctx, R.img, rightX, topY, panelW, panelH);

    // footer bar
    ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(0, height - footerH, width, footerH);

    // legends
    const maxLegendW = panelW * 0.9, maxLegendH = 72;
    if (snowLegend?.img) {
      drawContain(ctx, snowLegend.img, leftX, height - footerH + (footerH - maxLegendH) / 2, maxLegendW, maxLegendH);
    }
    if (ndviLegend?.img) {
      drawContain(ctx, ndviLegend.img, rightX, height - footerH + (footerH - maxLegendH) / 2, maxLegendW, maxLegendH);
    }

    // date (centered)
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center"; ctx.font = "600 36px system-ui";
    ctx.fillText(date, width / 2, height - 32);

    await video.add(t, frameDurationSec);
    t += frameDurationSec;

    if (L.urlToRevoke) URL.revokeObjectURL(L.urlToRevoke);
    if (R.urlToRevoke) URL.revokeObjectURL(R.urlToRevoke);
  }

  if (snowLegend?.urlToRevoke) URL.revokeObjectURL(snowLegend.urlToRevoke);
  if (ndviLegend?.urlToRevoke) URL.revokeObjectURL(ndviLegend.urlToRevoke);

  await output.finalize();
  //@ts-ignore
  return new Blob([output.target.buffer], { type: output.format.mimeType });
}

// -------------------- Component --------------------
export default function NasaMap({ labels, initialDate }: MapProps) {
  const [picked, setPicked] = useState<LatLngLiteral | null>(null);
  const [loading, setLoading] = useState(false);
  const [dateTuple, setDateTuple] = useState<[string, string]>(
    initialDate ? (initialDate.split("-") as [string, string]) : ["2001", "2003"]
  );
  const [videoMainUrl, setVideoMainUrl] = useState<string | null>(null);
  const [videoSideUrl, setVideoSideUrl] = useState<string | null>(null);

  const date = `${dateTuple[0]}-${dateTuple[1]}`;

  const run = async () => {
    if (!picked) {
      alert("Please select a location on the map.");
      return;
    }
    setLoading(true);
    setVideoMainUrl(null);
    setVideoSideUrl(null);

    try {
      // 1) Fetch all images with your existing util (returns { blob, date, layerGroup }[])
      const images = await getLayersData(dateTuple, picked, setLoading);

      // 2) Build main video (with per-frame legends)

      const main = await buildAdaVideoFromFrames({
        //@ts-ignore
        items: images,
        legends: LEGENDS,
        width: 1920,
        height: 1080,
        frameDurationSec: 1,
      });
      const mainUrl = URL.createObjectURL(main);
      setVideoMainUrl(mainUrl);

      // 3) Build Snow vs NDVI video
      const side = await buildSideBySideSnowVsNdvi({
        //@ts-ignore
        items: images,
        legends: LEGENDS,
        width: 1920,
        height: 1080,
      });
      const sideUrl = URL.createObjectURL(side);
      setVideoSideUrl(sideUrl);
    } catch (e) {
      console.error(e);
      alert("There was a problem building the video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      {loading ? (
        <div className="aspect-video text-lg rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-sm text-gray-900">
          <div>Loading…</div>
        </div>
      ) : null}

      {
        !loading && (!videoMainUrl && !videoSideUrl) ? <>
          {/* Preview/map */}
          <div className="aspect-video rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 grid place-items-center text-sm text-gray-500">
            <MapPicker
              height="100%"
              onSelect={(coord) => setPicked(coord)}
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
                onClick={run}
              >
                {labels.load}
              </button>
            </div>
          </div>
        </> : null
      }

      {/* Results */}
      {(videoMainUrl || videoSideUrl) && (
        <div className="mt-6 grid gap-6">
          {videoMainUrl && (
            <div>
              <h3 className="font-semibold mb-2">{labels.videoResultAllLayers}</h3>
              <video controls src={videoMainUrl} width={720} />
              <div>
                <a className="underline" href={videoMainUrl} download="ada-video.mp4">
                  {labels.videoDownloadLink}
                </a>
              </div>
            </div>
          )}
          {videoSideUrl && (
            <div>
              <h3 className="font-semibold mb-2">{labels.videoResultSideBySide}</h3>
              <video controls src={videoSideUrl} width={720} />
              <div>
                <a className="underline" href={videoSideUrl} download="ada-snow-vs-ndvi.mp4">
                  {labels.videoDownloadLink}
                </a>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}