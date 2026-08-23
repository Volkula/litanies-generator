import { FrameSheetLayout } from "../data/frameLibrary";
import { MonoColor } from "../types";

export interface FittedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Run {
  a: number;
  b: number;
}

const spriteCache = new Map<string, HTMLCanvasElement[]>();

function runsOf(flags: boolean[], minGap: number): Run[] {
  const raw: Run[] = [];
  let i = 0;
  while (i < flags.length) {
    while (i < flags.length && !flags[i]) i++;
    if (i >= flags.length) break;
    let j = i + 1;
    while (j < flags.length && flags[j]) j++;
    raw.push({ a: i, b: j - 1 });
    i = j;
  }
  if (raw.length === 0) return [];
  const merged: Run[] = [{ ...raw[0] }];
  for (let k = 1; k < raw.length; k++) {
    const prev = merged[merged.length - 1];
    if (raw[k].a - prev.b - 1 <= minGap) prev.b = raw[k].b;
    else merged.push({ ...raw[k] });
  }
  return merged;
}

function occupancyRows(
  data: Uint8ClampedArray,
  w: number,
  h: number
): boolean[] {
  const rows = new Array<boolean>(h).fill(false);
  for (let y = 0; y < h; y++) {
    const off = y * w * 4;
    for (let x = 0; x < w; x++) {
      if (data[off + x * 4 + 3] > 20) {
        rows[y] = true;
        break;
      }
    }
  }
  return rows;
}

function occupancyCols(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  y0 = 0,
  y1 = h - 1
): boolean[] {
  const cols = new Array<boolean>(w).fill(false);
  for (let x = 0; x < w; x++) {
    for (let y = y0; y <= y1; y++) {
      if (data[(y * w + x) * 4 + 3] > 20) {
        cols[x] = true;
        break;
      }
    }
  }
  return cols;
}

function tightBox(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): { x: number; y: number; w: number; h: number } | null {
  let minX = x1;
  let minY = y1;
  let maxX = x0;
  let maxY = y0;
  let found = false;
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      if (data[(y * w + x) * 4 + 3] > 20) {
        found = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (!found) return null;
  const pad = 2;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function clusterToN(flags: boolean[], n: number): Run[] {
  let gap = 1;
  let found = runsOf(flags, gap);
  while (found.length > n && gap < flags.length) {
    gap += 2;
    found = runsOf(flags, gap);
  }
  if (found.length === n) return found;
  if (found.length > n) return pickLargest(found, n);
  return equalSlices(flags.length, n);
}

function pickLargest(runs: Run[], n: number): Run[] {
  return [...runs]
    .sort((a, b) => b.b - b.a - (a.b - a.a))
    .slice(0, n)
    .sort((a, b) => a.a - b.a);
}

function equalSlices(len: number, n: number): Run[] {
  const out: Run[] = [];
  for (let i = 0; i < n; i++) {
    out.push({
      a: Math.round((len * i) / n),
      b: Math.round((len * (i + 1)) / n) - 1,
    });
  }
  return out;
}

function recolorAndPunch(
  img: HTMLImageElement,
  color: MonoColor
): { canvas: HTMLCanvasElement; data: Uint8ClampedArray } {
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
    return { canvas, data: new Uint8ClampedArray(w * h * 4) };
  }
  const px = image.data;
  const cr = color === "#ffffff" ? 255 : 0;
  // Line art is black (RGB 0) on transparent. Punching by luminance
  // deleted every stroke. Opacity is the ink mask.
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3];
    if (a < 16) {
      px[i + 3] = 0;
      continue;
    }
    px[i] = cr;
    px[i + 1] = cr;
    px[i + 2] = cr;
    px[i + 3] = a;
  }
  ctx.putImageData(image, 0, 0);
  return { canvas, data: px };
}

function cropCanvas(
  src: HTMLCanvasElement,
  box: { x: number; y: number; w: number; h: number }
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(box.w));
  out.height = Math.max(1, Math.round(box.h));
  const ctx = out.getContext("2d")!;
  ctx.drawImage(src, box.x, box.y, box.w, box.h, 0, 0, out.width, out.height);
  return out;
}

function sliceSheet(
  prepared: HTMLCanvasElement,
  data: Uint8ClampedArray,
  layout: FrameSheetLayout
): HTMLCanvasElement[] {
  const w = prepared.width;
  const h = prepared.height;
  const boxes: { x: number; y: number; w: number; h: number }[] = [];

  if (layout === "grid2x2") {
    const ys = clusterToN(occupancyRows(data, w, h), 2);
    const xs = clusterToN(occupancyCols(data, w, h), 2);
    const order: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    for (const [ci, ri] of order) {
      const col = xs[ci];
      const row = ys[ri];
      boxes.push(
        tightBox(data, w, h, col.a, row.a, col.b, row.b) ?? {
          x: col.a,
          y: row.a,
          w: col.b - col.a + 1,
          h: row.b - row.a + 1,
        }
      );
    }
  } else {
    const yRuns = clusterToN(occupancyRows(data, w, h), 4);
    for (const row of yRuns) {
      const xRuns = runsOf(occupancyCols(data, w, h, row.a, row.b), 4);
      const xr =
        xRuns.length > 0
          ? xRuns.reduce((best, cur) =>
              cur.b - cur.a > best.b - best.a ? cur : best
            )
          : { a: 0, b: w - 1 };
      boxes.push(
        tightBox(data, w, h, xr.a, row.a, xr.b, row.b) ?? {
          x: xr.a,
          y: row.a,
          w: xr.b - xr.a + 1,
          h: row.b - row.a + 1,
        }
      );
    }
  }

  return boxes.map((box) => cropCanvas(prepared, box));
}

export function getFrameSprites(
  img: HTMLImageElement,
  layout: FrameSheetLayout,
  color: MonoColor
): HTMLCanvasElement[] {
  const key = `${img.src}|${layout}|${color}|${img.naturalWidth}x${img.naturalHeight}|ink-alpha`;
  const hit = spriteCache.get(key);
  if (hit) return hit;
  try {
    const { canvas, data } = recolorAndPunch(img, color);
    const sprites = sliceSheet(canvas, data, layout);
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

export function containInBox(
  srcW: number,
  srcH: number,
  boxX: number,
  boxY: number,
  boxW: number,
  boxH: number
): FittedRect {
  const s = Math.min(boxW / Math.max(1, srcW), boxH / Math.max(1, srcH));
  const w = srcW * s;
  const h = srcH * s;
  return {
    x: boxX + (boxW - w) / 2,
    y: boxY + (boxH - h) / 2,
    w,
    h,
  };
}

export function frameDestRect(
  sprite: HTMLCanvasElement,
  canvasW: number,
  canvasH: number,
  scale: number
): FittedRect {
  const boxW = canvasW * scale;
  const boxH = canvasH * scale;
  const boxX = (canvasW - boxW) / 2;
  const boxY = (canvasH - boxH) / 2;
  return containInBox(sprite.width, sprite.height, boxX, boxY, boxW, boxH);
}
