
// Your item type
export type AdaFrame = {
  blob: Blob;              // should be a real Blob of the map image
  date: string;            // "YYYY-MM-DD"
  layerGroup: string;      // e.g. "MODIS_Terra_L3_NDVI_Monthly"
};

// ---- Canvas utilities ----
const createCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return c;
};

const drawCenteredText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  y: number,
  font = "bold 64px system-ui",
  shadow = true
) => {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (shadow) {
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 12;
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, ctx.canvas.width / 2, y);
  ctx.restore();
};

export async function makeIntroCanvas(
  title = "A.D.A",
  subtitle = "(Astronomical Data Animator)",
  w = 1920,
  h = 1080
): Promise<HTMLCanvasElement> {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  // background (monochrome aesthetic)
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);
  drawCenteredText(ctx, title, h * 0.42, "900 120px system-ui");
  drawCenteredText(ctx, subtitle, h * 0.55, "500 48px system-ui");
  return canvas;
}

export async function makeLayerTitleCanvas(
  layerName: string,
  w = 1920,
  h = 1080
): Promise<HTMLCanvasElement> {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, w, h);

  // subtle stripe divider
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(0, h * 0.5, w, 4);

  drawCenteredText(ctx, "Layer", h * 0.36, "700 60px system-ui");
  drawCenteredText(ctx, layerName, h * 0.6, "800 72px system-ui");
  return canvas;
}

// Convert a Blob image -> HTMLImageElement for drawing
//@ts-ignore
async function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    // URL.revokeObjectURL(url) will be called by caller after drawing to keep reuse possible
  }
}

//@ts-ignore
async function loadImageAny(
  src: Blob | string | HTMLImageElement
): Promise<{ img: HTMLImageElement; urlToRevoke?: string }> {
  if (src instanceof HTMLImageElement) return { img: src };
  if (typeof src === "string") {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";
    img.src = src;
    await img.decode();
    return { img };
  }
  // Blob
  const url = URL.createObjectURL(src);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  return { img, urlToRevoke: url };
}

//@ts-ignore
function _drawContain(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const iw = (img as any).width as number;
  const ih = (img as any).height as number;
  const s = Math.min(w / iw, h / ih);
  const dw = iw * s, dh = ih * s;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}
