import type { Dispatch, SetStateAction } from 'react'
import { BASE_LAYERS, INDIVIDUAL_LAYERS } from '../../utils'
import { makeIntroCanvas, makeLayerTitleCanvas, type AdaFrame } from './mediaBunnyAda';
import { BufferTarget, CanvasSource, Mp4OutputFormat, Output, QUALITY_HIGH } from 'mediabunny';
// const BACKEND_BASE_URL = "https://terra-cluster-opita-api.onrender.com/api/gibs/projections";

const NASA_BASE_URL =
  'https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi'

/**
 * Convert lon/lat (degrees) to an EPSG:3857 (Web Mercator) BBOX centered at the point.
 * The BBOX is a square of ±radiusKm in both X and Y (meters).
 *
 * @param lonDeg Longitude in degrees (-180..180)
 * @param latDeg Latitude in degrees (-90..90)
 * @param radiusKm Half-size in kilometers (default 100 km -> 200 km box)
 * @returns BBOX in meters { minx, miny, maxx, maxy } for EPSG:3857
 */
export function lonLatToMercatorBBox(
  lonDeg: number,
  latDeg: number,
  radiusKm: number = 100
): { minx: number; miny: number; maxx: number; maxy: number } {
  // Constants for Web Mercator (spherical)
  const R = 6378137 // meters
  const MAX_LAT = 85.05112878 // Web Mercator latitude limit

  const lon = normalizeLon(lonDeg)
  const lat = clamp(latDeg, -MAX_LAT, MAX_LAT)

  const λ = toRad(lon)
  const φ = toRad(lat)

  // Forward Web Mercator projection
  const x = R * λ
  const y = R * Math.log(Math.tan(Math.PI / 4 + φ / 2))

  const r = Math.abs(radiusKm) * 1000 // meters
  return {
    minx: x - r,
    miny: y - r,
    maxx: x + r,
    maxy: y + r,
  }
}

function toRad(d: number): number {
  return (d * Math.PI) / 180
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function normalizeLon(lon: number): number {
  // Wrap to [-180, 180)
  let L = ((((lon + 180) % 360) + 360) % 360) - 180
  // Treat -180 as 180 for cleanliness if needed
  if (L === -180) L = 180
  return L
}

function getMonthlyDateRange(start: string, end: string): string[] {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const dates = []
  let currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    dates.push(`${year}-${month}-01`)
    currentDate.setMonth(currentDate.getMonth() + 1)
  }
  return dates
}

export const getLayerType = (layerString: string) => {
  const isMoppitLayer = layerString.includes(
    'MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day'
  )
  const isModisNdviLayer = layerString.includes(
    'MODIS_Terra_L3_NDVI_Monthly'
  )
  const isModisNdsiLayer = layerString.includes(
    'MODIS_Terra_NDSI_Snow_Cover'
  )
  if (isMoppitLayer) return 'MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day'
  if (isModisNdviLayer) return 'MODIS_Terra_L3_NDVI_Monthly'
  if (isModisNdsiLayer) return 'MODIS_Terra_NDSI_Snow_Cover'
  return 'MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day' // default
}


export async function buildAdaVideoFromFrames(params: {
  items: AdaFrame[];
  fps?: number;
  frameDurationSec?: number;
  cardDurationSec?: number;
  introDurationSec?: number;
  width?: number; height?: number;
  legends?: Record<string, Blob | string | HTMLImageElement>; // NEW
}): Promise<Blob> {
  const {
    items,
    fps = 24,
    frameDurationSec = 1,
    cardDurationSec = 1.5,
    introDurationSec = 2.5,
    width = 1920,
    height = 1080,
    legends = {},               // NEW
  } = params;

  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  const output = new Output({
    format: new Mp4OutputFormat(),
    target: new BufferTarget(),
  });

  const workCanvas = createCanvas(width, height);
  //@ts-ignore
  const ctx = workCanvas.getContext("2d")!;
  //@ts-ignore
  const video = new CanvasSource(workCanvas, { codec: "avc", bitrate: QUALITY_HIGH });
  output.addVideoTrack(video, { frameRate: fps });
  await output.start();

  let t = 0;

  // Intro
  const intro = await makeIntroCanvas("A.D.A", "(Astronomical Data Animator)", width, height);
  ctx.drawImage(intro, 0, 0, width, height);
  await video.add(t, introDurationSec);
  t += introDurationSec;

  const uniqueLayers = [...new Set(sorted.map(s => s.layerGroup))];

  for (const layer of uniqueLayers) {
    const subset = sorted.filter(s => s.layerGroup === layer);

    // Title card
    const titleCard = await makeLayerTitleCanvas(layer, width, height);
    ctx.drawImage(titleCard, 0, 0, width, height);
    await video.add(t, cardDurationSec);
    t += cardDurationSec;

    // Preload legend if provided
    let legendImg: HTMLImageElement | undefined;
    let legendUrlToRevoke: string | undefined;
    if (legends[layer]) {
      const res = await loadImageAny(legends[layer]!);
      //@ts-ignore
      legendImg = res.img; legendUrlToRevoke = res.urlToRevoke;
    }

    // Dimensions for layout
    const footerH = 140;                 // black strip at bottom for legend/date
    const contentH = height - footerH;   // area for the map image

    for (const item of subset) {
      //@ts-ignore
      const { img: frameImg, urlToRevoke } = await loadImageAny(item.blob);

      // background
      ctx.fillStyle = "#111"; ctx.fillRect(0, 0, width, height);

      // main image (contain in the top area)
      drawContain(ctx, frameImg, 0, 0, width, contentH);

      // footer background
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(0, height - footerH, width, footerH);

      // left: layer + date text
      ctx.fillStyle = "#fff";
      ctx.font = "600 40px system-ui";
      ctx.textAlign = "left";
      ctx.fillText(item.layerGroup, 32, height - 88);
      ctx.font = "500 36px system-ui";
      ctx.fillText(item.date, 32, height - 36);

      // center: legend if present
      if (legendImg) {
        // keep legend compact: max width 60% of video, max height 72px
        const maxLegendW = width * 0.6;
        const maxLegendH = 72;
        const iw = legendImg.width, ih = legendImg.height;
        const s = Math.min(maxLegendW / iw, maxLegendH / ih);
        const dw = iw * s, dh = ih * s;
        const dx = (width - dw) / 2;
        const dy = height - footerH + (footerH - dh) / 2;
        ctx.drawImage(legendImg, dx, dy, dw, dh);
      }

      // right: small “A.D.A” tag
      ctx.textAlign = "right";
      ctx.font = "600 28px system-ui";
      ctx.fillText("A.D.A", width - 32, height - 40);

      await video.add(t, frameDurationSec);
      t += frameDurationSec;

      if (urlToRevoke) URL.revokeObjectURL(urlToRevoke);
    }

    if (legendUrlToRevoke) URL.revokeObjectURL(legendUrlToRevoke);
  }

  await output.finalize();
  //@ts-ignore
  return new Blob([output.target.buffer], { type: output.format.mimeType });
}


export const getLayersData = async (
  dateRange: [string, string],
  latlng: { lat: number; lng: number } | null,
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<{ blob: Blob; date: string; layerGroup: string }[]> => {
  if (!latlng) {
    alert("Please select a location on the map.");
    return [];
  }

  setLoading(true);

  const bbox = lonLatToMercatorBBox(latlng.lng, latlng.lat, 150);
  const bboxForMoppitLayer = lonLatToMercatorBBox(latlng.lng, latlng.lat, 2000);
  const [startYear, endYear] = dateRange;

  const monthlyDates = getMonthlyDateRange(
    `${startYear}-01-01`,
    `${endYear}-12-31`
  );

  const layersArray = INDIVIDUAL_LAYERS.map((layer) =>
    [...BASE_LAYERS.map((b) => b.id), layer.id].join(",")
  );

  const urls: string[] = layersArray.flatMap((layers) => {
    const isMoppitLayer = layers.includes("MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day");
    const definedBbox = isMoppitLayer ? bboxForMoppitLayer : bbox;

    return monthlyDates.map((date) => {
      const url = new URL(NASA_BASE_URL);
      url.searchParams.set("SERVICE", "WMS");
      url.searchParams.set("REQUEST", "GetMap");
      url.searchParams.set("VERSION", "1.3.0");
      url.searchParams.set("CRS", "EPSG:3857");
      url.searchParams.set("LAYERS", layers);
      url.searchParams.set("STYLES", "");
      url.searchParams.set("FORMAT", "image/png");
      url.searchParams.set("TRANSPARENT", "TRUE");
      url.searchParams.set("TIME", date);
      url.searchParams.set("BBOX", `${definedBbox.minx},${definedBbox.miny},${definedBbox.maxx},${definedBbox.maxy}`);
      url.searchParams.set("WIDTH", isMoppitLayer ? "1500" : "960");
      url.searchParams.set("HEIGHT", "960");
      return url.toString();
    });
  });

  // Fetch 15 at a time
  const results: { blob: Blob; date: string; layerGroup: string }[] = [];
  const chunkSize = 15;

  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    const responses = await Promise.all(
      chunk.map(async (url) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed ${res.status} for ${url}`);
        const blob = await res.blob();
        const date = url.match(/TIME=([^&]*)/)?.[1] ?? "unknown";
        const layers = url.match(/LAYERS=([^&]*)/)?.[1] ?? "unknown";
        const layerGroup = getLayerType(layers);
        return { blob, date, layerGroup };
      })
    );
    results.push(...responses);
  }
  return results;
};


function createCanvas(_width: number, _height: number) {
  throw new Error('Function not implemented.');
}

function loadImageAny(_arg0: string | Blob | HTMLImageElement) {
  throw new Error('Function not implemented.');
}

function drawContain(_ctx: any, _frameImg: any, _arg2: number, _arg3: number, _width: number, _contentH: number) {
  throw new Error('Function not implemented.');
}

const LAYER_LABELS: Record<string, string> = {
  "MOPITT_CO_Monthly_Surface_Mixing_Ratio_Day": "CO (Surface Mixing Ratio) — MOPITT",
  "MODIS_Terra_L3_NDVI_Monthly": "NDVI — MODIS Terra (Monthly)",
  "MODIS_Terra_NDSI_Snow_Cover": "Snow Coverage (NDSI) — MODIS Terra",
};

export const labelFor = (layerGroup: string) =>
  LAYER_LABELS[layerGroup] ?? layerGroup;

