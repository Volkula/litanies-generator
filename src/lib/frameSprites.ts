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
  let solid = 0;
  for (let i = 3; i < px.length; i += 4) {
    if (px[i] > 200) solid++;
  }
  const solidBg = solid > (w * h) / 4;
  const ink = new Uint8Array(w * h);
  for (let p = 0, i = 0; p < ink.length; p++, i += 4) {
    const a = px[i + 3];
    const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
    if (solidBg) {
      ink[p] = a > 8 && lum > 40 ? a : 0;
    } else {
      ink[p] = a > 4 ? a : 0;
    }
  }
  // Hairlines vanish when scaled; two dilate passes keep a visible stroke.
  let prev = ink;
  let next = new Uint8Array(ink.length);
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let m = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const xx = x + dx;
            const yy = y + dy;
            if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
            const v = prev[yy * w + xx];
            if (v > m) m = v;
          }
        }
        next[y * w + x] = m;
      }
    }
    const tmp = prev;
    prev = next;
    next = tmp;
  }
  const dilate = prev;
  const cr = color === "#ffffff" ? 255 : 0;
  for (let p = 0, i = 0; p < dilate.length; p++, i += 4) {
    const a = dilate[p];
    if (a < 5) {
      px[i] = 0;
      px[i + 1] = 0;
      px[i + 2] = 0;
      px[i + 3] = 0;
    } else {
      px[i] = cr;
      px[i + 1] = cr;
      px[i + 2] = cr;
      px[i + 3] = a;
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
  const key = `${img.src}|${layout}|${color}|${img.naturalWidth}x${img.naturalHeight}|v4`;
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

/** Stretch the full banner onto the scaled canvas so it surrounds the litany. */
export function frameDestRect(
  _sprite: HTMLCanvasElement,
  canvasW: number,
  canvasH: number,
  scale: number
): FittedRect {
  const w = canvasW * scale;
  const h = canvasH * scale;
  return {
    x: (canvasW - w) / 2,
    y: (canvasH - h) / 2,
    w,
    h,
  };
}

const strokeCache = new WeakMap<HTMLCanvasElement, Map<string, HTMLCanvasElement>>();

/**
 * Scale the hairline banner to the canvas, then stamp it on a disk so the
 * stroke reads as a frame instead of a 1px scratch.
 */
export function strokeFrameSprite(
  sprite: HTMLCanvasElement,
  destW: number,
  destH: number,
  thickness: number
): HTMLCanvasElement {
  const w = Math.max(1, Math.round(destW));
  const h = Math.max(1, Math.round(destH));
  const radius = Math.max(8, Math.round(thickness));
  const key = `${w}x${h}|r${radius}`;
  const bucket = strokeCache.get(sprite) ?? new Map<string, HTMLCanvasElement>();
  strokeCache.set(sprite, bucket);
  const hit = bucket.get(key);
  if (hit) return hit;

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;
  const r2 = radius * radius;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx * dx + dy * dy > r2) continue;
      ctx.drawImage(sprite, dx, dy, w, h);
    }
  }
  bucket.set(key, out);
  return out;
}
