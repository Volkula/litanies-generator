import { EditorState, TextLayer } from "../types";
import {
  frameSheetForStyle,
  frameSheetUrl,
  isBorderFrameStyle,
  normalizedFrameScale,
  normalizedFrameVariant,
} from "../data/frameLibrary";
import { getCanvasDimensions } from "./canvasSize";
import { frameDestRect, getFrameSprite, strokeFrameSprite } from "./frameSprites";
import { getImage } from "./images";
import { drawFrame, drawRasterContent, wrapText } from "./render";

const SVG_FONT_IMPORT =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=IM+Fell+English:ital@0;1&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=UnifrakturMaguntia&family=MedievalSharp&family=Pirata+One&family=Marcellus+SC&family=Metamorphous&family=Ruslan+Display&family=Yeseva+One&family=Forum&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&display=swap";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/png");
}

async function waitForImage(src: string): Promise<HTMLImageElement | null> {
  const cached = getImage(src);
  if (cached) return cached;
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timer = window.setTimeout(() => resolve(null), 8000);
    img.onload = () => {
      window.clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      window.clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

function measureCtx(): CanvasRenderingContext2D {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.getContext("2d")!;
}

function fontString(layer: TextLayer): string {
  return `${layer.italic ? "italic " : ""}${layer.fontWeight} ${layer.fontSize}px ${layer.fontFamily}`;
}

function svgFontFamily(family: string): string {
  return family.replace(/'/g, "");
}

function textLayerSvg(layer: TextLayer, ctx: CanvasRenderingContext2D): string {
  if (!layer.visible) return "";
  ctx.font = fontString(layer);
  try {
    (ctx as unknown as { letterSpacing: string }).letterSpacing =
      `${layer.letterSpacing}px`;
  } catch {
    /* ignore */
  }
  const content = layer.uppercase ? layer.text.toUpperCase() : layer.text;
  const lines = wrapText(ctx, content, layer.maxWidth);
  const lineH = layer.fontSize * layer.lineHeight;
  const anchor =
    layer.align === "center"
      ? "middle"
      : layer.align === "right"
        ? "end"
        : "start";
  const spacing =
    layer.letterSpacing !== 0
      ? ` letter-spacing="${layer.letterSpacing}"`
      : "";
  // One <text> per line with hanging baseline (matches canvas textBaseline=top).
  // tspan+dy collapses to a single line in Illustrator/Inkscape/Corel.
  return lines
    .map((line, i) => {
      const y = layer.y + i * lineH;
      return `<text x="${layer.x}" y="${y.toFixed(2)}" text-anchor="${anchor}" dominant-baseline="hanging" alignment-baseline="hanging" font-family="${escapeXml(svgFontFamily(layer.fontFamily))}" font-size="${layer.fontSize}px" font-weight="${layer.fontWeight}" font-style="${layer.italic ? "italic" : "normal"}" fill="${layer.color}"${spacing} xml:space="preserve">${escapeXml(line || " ")}</text>`;
    })
    .join("\n");
}

async function frameLayerDataUrl(state: EditorState): Promise<string | null> {
  const { width, height } = getCanvasDimensions(state);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  drawFrame(ctx, state);
  return canvasToDataUrl(canvas);
}

async function rasterContentDataUrl(state: EditorState): Promise<string> {
  const { width, height } = getCanvasDimensions(state);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  drawRasterContent(ctx, state);
  return canvasToDataUrl(canvas);
}

/** Build an SVG document mirroring the current scene (text stays vector). */
export async function exportSvg(state: EditorState): Promise<Blob> {
  const { width, height } = getCanvasDimensions(state);
  const ctx = measureCtx();
  const parts: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<defs><style type="text/css">@import url('${SVG_FONT_IMPORT}');</style></defs>`,
    `<rect width="100%" height="100%" fill="${state.canvasBg}"/>`,
  ];

  const rasterHref = await rasterContentDataUrl(state);
  parts.push(
    `<image href="${rasterHref}" x="0" y="0" width="${width}" height="${height}" />`
  );

  for (const layer of state.layers) {
    if (layer.type === "text") {
      parts.push(textLayerSvg(layer, ctx));
    }
  }

  if (state.frame.enabled && state.frame.exportWithFrame) {
    const frameHref = await frameLayerDataUrl(state);
    if (frameHref) {
      parts.push(
        `<image href="${frameHref}" x="0" y="0" width="${width}" height="${height}" />`
      );
    }
  }

  parts.push("</svg>");
  return new Blob([parts.join("\n")], { type: "image/svg+xml;charset=utf-8" });
}

/** Frame-only SVG with a prepared sprite (useful for asset pipelines). */
export async function exportFrameSvg(state: EditorState): Promise<Blob | null> {
  if (!state.frame.enabled) return null;
  const { width, height } = getCanvasDimensions(state);
  const f = state.frame;

  if (isBorderFrameStyle(f.style)) {
    const sheet = frameSheetForStyle(f.style);
    if (!sheet) return null;
    const img = await waitForImage(frameSheetUrl(sheet));
    if (!img) return null;
    const sprite = getFrameSprite(
      img,
      sheet.layout,
      normalizedFrameVariant(f, sheet.variants.length || 1),
      f.color
    );
    if (!sprite) return null;
    const dest = frameDestRect(
      sprite,
      width,
      height,
      normalizedFrameScale(f)
    );
    const stroked = strokeFrameSprite(sprite, dest.w, dest.h, f.thickness);
    const href = canvasToDataUrl(stroked);
    const svg = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
      `<image href="${href}" x="${dest.x}" y="${dest.y}" width="${dest.w}" height="${dest.h}" />`,
      "</svg>",
    ].join("\n");
    return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  }

  const frameHref = await frameLayerDataUrl(state);
  if (!frameHref) return null;
  const svg = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<image href="${frameHref}" x="0" y="0" width="${width}" height="${height}" />`,
    "</svg>",
  ].join("\n");
  return new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
}

