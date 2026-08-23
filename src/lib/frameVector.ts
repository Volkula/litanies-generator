import {
  frameSheetForStyle,
  frameSheetUrl,
  isBorderFrameStyle,
  normalizedFrameScale,
  normalizedFrameVariant,
} from "../data/frameLibrary";
import { EditorState } from "../types";
import { getCanvasDimensions } from "./canvasSize";
import { FittedRect, frameDestRect, getFrameSprite } from "./frameSprites";
import { getImage, hasFailed } from "./images";
import { bannerPathD } from "./render";
import { canvasToFrameVector } from "./traceBitmap";

function waitForImage(src: string): Promise<HTMLImageElement | null> {
  const cached = getImage(src);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    const started = performance.now();
    const tick = () => {
      const hit = getImage(src);
      if (hit) {
        resolve(hit);
        return;
      }
      if (hasFailed(src) || performance.now() - started > 8000) {
        resolve(null);
        return;
      }
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

function n(v: number): string {
  return (Math.round(v * 100) / 100).toString();
}

function tracedSpriteSvg(
  sprite: HTMLCanvasElement,
  dest: FittedRect,
  color: string
): string {
  const traced = canvasToFrameVector(sprite);
  if (!traced.d) return "";
  const sx = dest.w / sprite.width;
  const sy = dest.h / sprite.height;
  const paint = traced.fill
    ? `fill="${color}" fill-rule="${traced.fillRule}"`
    : `fill="none" stroke="${color}" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round"`;
  return [
    `<g transform="translate(${n(dest.x)} ${n(dest.y)}) scale(${n(sx)} ${n(sy)})" shape-rendering="geometricPrecision">`,
    `<path d="${traced.d}" ${paint}/>`,
    "</g>",
  ].join("");
}

function proceduralFrameSvg(state: EditorState): string {
  const f = state.frame;
  const { width: canvasW, height: canvasH } = getCanvasDimensions(state);
  const m = f.margin;
  const t = f.thickness;
  const color = f.color;
  const innerW = canvasW - 2 * m;
  const innerH = canvasH - 2 * m;

  const strokeRect = (off: number, thick: number) => {
    const x = m + off + thick / 2;
    const y = m + off + thick / 2;
    const w = innerW - 2 * off - thick;
    const h = innerH - 2 * off - thick;
    return `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="none" stroke="${color}" stroke-width="${n(thick)}" shape-rendering="geometricPrecision"/>`;
  };

  if (f.style === "banner") {
    return `<path d="${bannerPathD(m, canvasW, canvasH)}" fill="none" stroke="${color}" stroke-width="${n(t)}" stroke-linejoin="round" stroke-linecap="round" shape-rendering="geometricPrecision"/>`;
  }
  if (f.style === "thin" || f.style === "classic") {
    return strokeRect(0, t);
  }
  if (f.style === "double") {
    return strokeRect(0, t) + strokeRect(t + 8, Math.max(2, t / 2));
  }
  if (f.style === "ornate") {
    const corners = [
      [m, m],
      [canvasW - m, m],
      [m, canvasH - m],
      [canvasW - m, canvasH - m],
    ];
    const dots = corners
      .map(
        ([cx, cy]) =>
          `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(t * 0.9)}" fill="${color}"/>`
      )
      .join("");
    return strokeRect(0, t) + strokeRect(t + 10, Math.max(2, t / 3)) + dots;
  }
  return "";
}

/** Vector markup for the current frame, or empty string if none. */
export async function frameSvgMarkup(state: EditorState): Promise<string> {
  if (!state.frame.enabled) return "";
  const f = state.frame;

  if (isBorderFrameStyle(f.style)) {
    const sheet = frameSheetForStyle(f.style);
    if (!sheet) return "";
    const img = await waitForImage(frameSheetUrl(sheet));
    if (!img) return "";
    const sprite = getFrameSprite(
      img,
      sheet.layout,
      normalizedFrameVariant(f, sheet.variants.length || 1),
      f.color
    );
    if (!sprite) return "";
    const { width, height } = getCanvasDimensions(state);
    const dest = frameDestRect(sprite, width, height, normalizedFrameScale(f));
    return tracedSpriteSvg(sprite, dest, f.color);
  }

  return proceduralFrameSvg(state);
}
