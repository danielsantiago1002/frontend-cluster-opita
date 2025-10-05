import type { Dispatch, SetStateAction } from "react";

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
  const R = 6378137; // meters
  const MAX_LAT = 85.05112878; // Web Mercator latitude limit

  const lon = normalizeLon(lonDeg);
  const lat = clamp(latDeg, -MAX_LAT, MAX_LAT);

  const λ = toRad(lon);
  const φ = toRad(lat);

  // Forward Web Mercator projection
  const x = R * λ;
  const y = R * Math.log(Math.tan(Math.PI / 4 + φ / 2));

  const r = Math.abs(radiusKm) * 1000; // meters
  return {
    minx: x - r,
    miny: y - r,
    maxx: x + r,
    maxy: y + r
  };
}

function toRad(d: number): number {
  return (d * Math.PI) / 180;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function normalizeLon(lon: number): number {
  // Wrap to [-180, 180)
  let L = ((lon + 180) % 360 + 360) % 360 - 180;
  // Treat -180 as 180 for cleanliness if needed
  if (L === -180) L = 180;
  return L;
}


export const getLayersData = (
  dateRange: [string, string],
  latlng: { lat: number; lng: number } | null,
  setLoading: Dispatch<SetStateAction<boolean>>
) => {

  if (!latlng) {
    alert("Please select a location on the map.");
    return;
  }

  setLoading(true);

  const bbox = lonLatToMercatorBBox(latlng.lng, latlng.lat, 100);
  const [startYear, endYear] = dateRange;

  debugger;


}
