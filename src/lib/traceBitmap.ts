/** Subpixel contour tracer: alpha isosurface → cubic SVG path (evenodd). */

export interface Pt {
  x: number;
  y: number;
}

const THRESHOLD = 80;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interp(
  x0: number,
  y0: number,
  v0: number,
  x1: number,
  y1: number,
  v1: number
): Pt {
  const t = (THRESHOLD - v0) / (v1 - v0 || 1e-6);
  return { x: lerp(x0, x1, t), y: lerp(y0, y1, t) };
}

function sample(
  alpha: Uint8Array,
  w: number,
  h: number,
  x: number,
  y: number
): number {
  if (x < 0 || y < 0 || x >= w || y >= h) return 0;
  return alpha[y * w + x];
}

function padMask(
  alpha: Uint8Array,
  w: number,
  h: number,
  pad: number
): { alpha: Uint8Array; w: number; h: number } {
  const W = w + pad * 2;
  const H = h + pad * 2;
  const out = new Uint8Array(W * H);
  for (let y = 0; y < h; y++) {
    out.set(alpha.subarray(y * w, y * w + w), (y + pad) * W + pad);
  }
  return { alpha: out, w: W, h: H };
}

function isProperClosed(loop: Pt[]): boolean {
  if (loop.length < 4) return false;
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % loop.length];
    if (Math.hypot(b.x - a.x, b.y - a.y) > 4) return false;
  }
  return true;
}

function hid(x: number, y: number): string {
  return `h:${x}:${y}`;
}
function vid(x: number, y: number): string {
  return `v:${x}:${y}`;
}

interface EdgeNode {
  id: string;
  pt: Pt;
}

/**
 * Marching squares on the alpha channel. Returns closed loops in pixel space.
 * Segments are chained by shared grid-edge ids so the walk cannot jump.
 */
export function traceAlphaLoops(
  alpha: Uint8Array,
  w: number,
  h: number
): Pt[][] {
  const links = new Map<string, string[]>();
  const pts = new Map<string, Pt>();

  const connect = (a: EdgeNode, b: EdgeNode) => {
    pts.set(a.id, a.pt);
    pts.set(b.id, b.pt);
    const la = links.get(a.id);
    if (la) la.push(b.id);
    else links.set(a.id, [b.id]);
    const lb = links.get(b.id);
    if (lb) lb.push(a.id);
    else links.set(b.id, [a.id]);
  };

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const tl = sample(alpha, w, h, x, y);
      const tr = sample(alpha, w, h, x + 1, y);
      const br = sample(alpha, w, h, x + 1, y + 1);
      const bl = sample(alpha, w, h, x, y + 1);
      const idx =
        (tl >= THRESHOLD ? 8 : 0) |
        (tr >= THRESHOLD ? 4 : 0) |
        (br >= THRESHOLD ? 2 : 0) |
        (bl >= THRESHOLD ? 1 : 0);
      if (idx === 0 || idx === 15) continue;

      const top: EdgeNode = {
        id: hid(x, y),
        pt: interp(x, y, tl, x + 1, y, tr),
      };
      const right: EdgeNode = {
        id: vid(x + 1, y),
        pt: interp(x + 1, y, tr, x + 1, y + 1, br),
      };
      const bottom: EdgeNode = {
        id: hid(x, y + 1),
        pt: interp(x, y + 1, bl, x + 1, y + 1, br),
      };
      const left: EdgeNode = {
        id: vid(x, y),
        pt: interp(x, y, tl, x, y + 1, bl),
      };

      const avg = (tl + tr + br + bl) / 4;
      switch (idx) {
        case 1:
        case 14:
          connect(left, bottom);
          break;
        case 2:
        case 13:
          connect(bottom, right);
          break;
        case 3:
        case 12:
          connect(left, right);
          break;
        case 4:
        case 11:
          connect(top, right);
          break;
        case 6:
        case 9:
          connect(top, bottom);
          break;
        case 7:
        case 8:
          connect(left, top);
          break;
        case 5:
          if (avg >= THRESHOLD) {
            connect(left, top);
            connect(bottom, right);
          } else {
            connect(left, bottom);
            connect(top, right);
          }
          break;
        case 10:
          if (avg >= THRESHOLD) {
            connect(left, bottom);
            connect(top, right);
          } else {
            connect(left, top);
            connect(bottom, right);
          }
          break;
        default:
          break;
      }
    }
  }

  const used = new Set<string>();
  const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const loops: Pt[][] = [];

  const walk = (start: string, next: string) => {
    const loop: Pt[] = [pts.get(start)!];
    used.add(pairKey(start, next));
    let prev = start;
    let curr = next;
    const limit = links.size + 2;
    for (let i = 0; i < limit; i++) {
      loop.push(pts.get(curr)!);
      const nbrs = links.get(curr) ?? [];
      let found: string | null = null;
      for (const n of nbrs) {
        if (n === prev) continue;
        const pk = pairKey(curr, n);
        if (used.has(pk)) continue;
        found = n;
        break;
      }
      if (found === null) break;
      used.add(pairKey(curr, found));
      prev = curr;
      curr = found;
      if (curr === start) break;
    }
    if (loop.length >= 4) loops.push(loop);
  };

  for (const [id, nbrs] of links) {
    for (const n of nbrs) {
      const pk = pairKey(id, n);
      if (used.has(pk)) continue;
      walk(id, n);
    }
  }

  return loops;
}

function ptKey(p: Pt): string {
  return `${Math.round(p.x * 64)},${Math.round(p.y * 64)}`;
}

function dist2(a: Pt, b: Pt): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function dedupeLoop(loop: Pt[], minDist: number): Pt[] {
  const pts =
    loop.length > 1 && ptKey(loop[0]) === ptKey(loop[loop.length - 1])
      ? loop.slice(0, -1)
      : loop.slice();
  if (pts.length < 4) return pts;
  const md2 = minDist * minDist;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (dist2(out[out.length - 1], pts[i]) >= md2) out.push(pts[i]);
  }
  if (out.length > 2 && dist2(out[0], out[out.length - 1]) < md2) out.pop();
  return out.length >= 3 ? out : pts;
}

function chaikin(loop: Pt[], iters: number): Pt[] {
  let pts =
    loop.length > 1 && ptKey(loop[0]) === ptKey(loop[loop.length - 1])
      ? loop.slice(0, -1)
      : loop.slice();
  for (let n = 0; n < iters; n++) {
    const next: Pt[] = [];
    const len = pts.length;
    for (let i = 0; i < len; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % len];
      next.push({ x: lerp(a.x, b.x, 0.25), y: lerp(a.y, b.y, 0.25) });
      next.push({ x: lerp(a.x, b.x, 0.75), y: lerp(a.y, b.y, 0.75) });
    }
    pts = next;
  }
  return pts;
}

function fmt(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Object.is(r, -0) ? "0" : String(r);
}

/** Closed loop → polyline SVG path (no cubics: they cross on 1px ribbons). */
export function loopToPolyPath(loop: Pt[]): string {
  const pts =
    loop.length > 1 && ptKey(loop[0]) === ptKey(loop[loop.length - 1])
      ? loop.slice(0, -1)
      : loop;
  if (pts.length < 3) return "";
  let d = `M${fmt(pts[0].x)} ${fmt(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) {
    d += `L${fmt(pts[i].x)} ${fmt(pts[i].y)}`;
  }
  return d + "Z";
}

function alphaFromCanvas(canvas: HTMLCanvasElement): Uint8Array | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  let image: ImageData;
  try {
    image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch {
    return null;
  }
  const a = new Uint8Array(canvas.width * canvas.height);
  const px = image.data;
  for (let p = 0, i = 3; p < a.length; p++, i += 4) a[p] = px[i];
  return a;
}

export interface FrameVector {
  d: string;
  fill: boolean;
  fillRule: "evenodd" | "nonzero";
}

function loopPerimeter(loop: Pt[]): number {
  let peri = 0;
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % loop.length];
    peri += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return peri;
}

function shoelaceAbs(loop: Pt[]): number {
  let a = 0;
  for (let i = 0; i < loop.length; i++) {
    const p = loop[i];
    const q = loop[(i + 1) % loop.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

const TRACE_REV = 13;
const pathCache = new WeakMap<
  HTMLCanvasElement,
  { rev: number; v: FrameVector }
>();

/**
 * Trace a hairline banner to SVG path data in the canvas pixel space.
 * Thin ink regions are filled ribbons (nonzero); large holes are dropped.
 */
export function canvasToFrameVector(canvas: HTMLCanvasElement): FrameVector {
  const cached = pathCache.get(canvas);
  if (cached && cached.rev === TRACE_REV) return cached.v;
  const empty = { d: "", fill: false, fillRule: "nonzero" as const };
  const rawAlpha = alphaFromCanvas(canvas);
  if (!rawAlpha) {
    pathCache.set(canvas, { rev: TRACE_REV, v: empty });
    return empty;
  }
  const pad = 2;
  const padded = padMask(rawAlpha, canvas.width, canvas.height, pad);
  const loops = traceAlphaLoops(padded.alpha, padded.w, padded.h);
  const simplified: Pt[][] = [];
  for (const raw of loops) {
    if (!isProperClosed(raw)) continue;
    const shifted = raw.map((p) => ({ x: p.x - pad, y: p.y - pad }));
    const smooth = chaikin(shifted, 1);
    const simple = dedupeLoop(smooth, 0.45);
    if (simple.length < 4) continue;
    let peri = 0;
    for (let i = 0; i < simple.length; i++) {
      const a = simple[i];
      const b = simple[(i + 1) % simple.length];
      peri += Math.hypot(b.x - a.x, b.y - a.y);
    }
    if (peri < 48) continue;
    simplified.push(simple);
  }
  simplified.sort((a, b) => shoelaceAbs(b) - shoelaceAbs(a));
  const ribbons = simplified.filter((loop) => {
    const t = (2 * shoelaceAbs(loop)) / (loopPerimeter(loop) || 1);
    return t < 8;
  });
  const used = ribbons.length ? ribbons : simplified.slice(0, 1);
  if (!used.length) {
    pathCache.set(canvas, { rev: TRACE_REV, v: empty });
    return empty;
  }
  const d = used.map((loop) => loopToPolyPath(loop)).join("");
  const v: FrameVector = {
    d,
    fill: true,
    fillRule: "nonzero",
  };
  pathCache.set(canvas, { rev: TRACE_REV, v });
  return v;
}
