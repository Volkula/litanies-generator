import { FrameSheetLayout } from "../data/frameLibrary";
import { MonoColor } from "../types";

export interface FittedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

const spriteCache = new Map<string, HTMLCanvasElement[]>();

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
  const ink: Uint8Array = new Uint8Array(w * h);
  for (let p = 0, i = 0; p < ink.length; p++, i += 4) {
    const a = px[i + 3];
    const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
    if (solidBg) {
      ink[p] = a > 8 && lum > 40 ? a : 0;
    } else {
      ink[p] = a > 4 ? a : 0;
    }
  }
  // 1px dilate so hairline strokes survive scaling.
  const dilate = new Uint8Array(ink);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
          const v = ink[yy * w + xx];
          if (v > m) m = v;
        }
      }
      dilate[y * w + x] = m;
    }
  }
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

function sliceSheet(
  sheet: HTMLCanvasElement,
  layout: FrameSheetLayout
): HTMLCanvasElement[] {
  const w = sheet.width;
  const h = sheet.height;
  if (layout === "grid2x2") {
    const cw = w / 2;
    const ch = h / 2;
    return [0, 1, 2, 3].map((v) => {
      const col = v % 2;
      const row = Math.floor(v / 2);
      return crop(sheet, col * cw, row * ch, cw, ch);
    });
  }
  const ch = h / 4;
  return [0, 1, 2, 3].map((v) => crop(sheet, 0, v * ch, w, ch));
}

export function getFrameSprites(
  img: HTMLImageElement,
  layout: FrameSheetLayout,
  color: MonoColor
): HTMLCanvasElement[] {
  const key = `${img.src}|${layout}|${color}|${img.naturalWidth}x${img.naturalHeight}|v3`;
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
  const v = Math.max(0, Math.min(sprites.length - 1, variant));
  return sprites[v] ?? null;
}

/** Stretch the sprite onto the scaled canvas rect so the frame reaches the edges. */
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
