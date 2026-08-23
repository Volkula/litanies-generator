import { FrameSheetLayout } from "../data/frameLibrary";
import { MonoColor } from "../types";

export interface FittedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const spriteCache = new Map<string, HTMLCanvasElement[]>();
const MIN_COLUMN_WIDTH = 8;

/** Recolor ink to black/white, keep the original hairline alpha. No dilate. */
function extractInk(
  img: HTMLImageElement,
  color: MonoColor
): HTMLCanvasElement {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  let image: ImageData;
  try {
    image = ctx.getImageData(0, 0, w, h);
  } catch {
    return canvas;
  }
  const px = image.data;
  const cr = color === "#ffffff" ? 255 : 0;
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 5) {
      px[i] = 0;
      px[i + 1] = 0;
      px[i + 2] = 0;
      px[i + 3] = 0;
    } else {
      px[i] = cr;
      px[i + 1] = cr;
      px[i + 2] = cr;
      // keep original anti-aliased alpha
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

function crop(
  src: HTMLCanvasElement,
  x: number,
  y: number,
  cw: number,
  ch: number
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(cw));
  out.height = Math.max(1, Math.round(ch));
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(src, x, y, cw, ch, 0, 0, out.width, out.height);
  return out;
}

function columnRuns(sheet: HTMLCanvasElement): [number, number][] {
  const w = sheet.width;
  const h = sheet.height;
  const ctx = sheet.getContext("2d")!;
  let image: ImageData;
  try {
    image = ctx.getImageData(0, 0, w, h);
  } catch {
    return [[0, w - 1]];
  }
  const px = image.data;
  const used = new Uint8Array(w);
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      if (px[(y * w + x) * 4 + 3] > 4) {
        used[x] = 1;
        break;
      }
    }
  }
  const runs: [number, number][] = [];
  let x = 0;
  while (x < w) {
    while (x < w && !used[x]) x++;
    if (x >= w) break;
    const x0 = x;
    while (x < w && used[x]) x++;
    if (x - x0 >= MIN_COLUMN_WIDTH) runs.push([x0, x - 1]);
  }
  return runs.length ? runs : [[0, w - 1]];
}

function sliceSheet(
  sheet: HTMLCanvasElement,
  layout: FrameSheetLayout
): HTMLCanvasElement[] {
  if (layout === "single") {
    return [crop(sheet, 0, 0, sheet.width, sheet.height)];
  }
  return columnRuns(sheet).map(([x0, x1]) =>
    crop(sheet, x0, 0, x1 - x0 + 1, sheet.height)
  );
}

export function getFrameSprites(
  img: HTMLImageElement,
  layout: FrameSheetLayout,
  color: MonoColor
): HTMLCanvasElement[] {
  const key = `${img.src}|${layout}|${color}|${img.naturalWidth}x${img.naturalHeight}|v5`;
  const hit = spriteCache.get(key);
  if (hit) return hit;
  try {
    const sprites = sliceSheet(extractInk(img, color), layout);
    spriteCache.set(key, sprites);
    return sprites;
  } catch {
    return [];
  }
}

export function getFrameSprite(
  img: HTMLImageElement,
  layout: FrameSheetLayout,
  variant: number,
  color: MonoColor
): HTMLCanvasElement | null {
  const sprites = getFrameSprites(img, layout, color);
  if (!sprites.length) return null;
  const v = Math.max(0, Math.min(sprites.length - 1, variant));
  return sprites[v] ?? null;
}

/**
 * Fit the banner inside the canvas, keeping its original aspect ratio.
 * `scale` 1 = 100% fit; larger values zoom (may clip).
 */
export function frameDestRect(
  sprite: HTMLCanvasElement,
  canvasW: number,
  canvasH: number,
  scale: number
): FittedRect {
  const fit = Math.min(canvasW / sprite.width, canvasH / sprite.height);
  const w = sprite.width * fit * scale;
  const h = sprite.height * fit * scale;
  return {
    x: (canvasW - w) / 2,
    y: (canvasH - h) / 2,
    w,
    h,
  };
}
