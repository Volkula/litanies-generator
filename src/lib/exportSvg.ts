import { EditorState, ImageLayer, TextLayer } from "../types";
import { getCanvasDimensions } from "./canvasSize";
import { drawRasterContent, wrapText } from "./render";
import {
  imageLayerSvgMarkup,
  isFullImageCrop,
  isLocalVectorSrc,
  loadSvgText,
} from "./vectorSrc";

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
    layer.letterSpacing !== 0 ? ` letter-spacing="${layer.letterSpacing}"` : "";
  // One <text> per line with hanging baseline (matches canvas textBaseline=top).
  // tspan+dy collapses to a single line in Illustrator/Inkscape/Corel.
  return lines
    .map((line, i) => {
      const y = layer.y + i * lineH;
      return `<text x="${layer.x}" y="${y.toFixed(2)}" text-anchor="${anchor}" dominant-baseline="hanging" alignment-baseline="hanging" font-family="${escapeXml(svgFontFamily(layer.fontFamily))}" font-size="${layer.fontSize}px" font-weight="${layer.fontWeight}" font-style="${layer.italic ? "italic" : "normal"}" fill="${layer.color}"${spacing} xml:space="preserve">${escapeXml(line || " ")}</text>`;
    })
    .join("\n");
}

function rasterSliceDataUrl(
  state: EditorState,
  imageLayers: ImageLayer[],
  mode: "base" | "overlay"
): string | null {
  if (mode === "overlay" && imageLayers.length === 0) return null;
  const hasBg = Boolean(state.background.src && state.background.visible);
  if (
    mode === "base" &&
    imageLayers.length === 0 &&
    !hasBg &&
    !state.bw.enabled
  ) {
    return null;
  }

  const { width, height } = getCanvasDimensions(state);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const sub: EditorState = {
    ...state,
    layers: imageLayers,
    background:
      mode === "base"
        ? state.background
        : { ...state.background, src: null, visible: false },
  };
  drawRasterContent(ctx, sub, { transparent: mode === "overlay" });
  return canvasToDataUrl(canvas);
}

function pushRaster(
  parts: string[],
  state: EditorState,
  batch: ImageLayer[],
  mode: "base" | "overlay"
) {
  const href = rasterSliceDataUrl(state, batch, mode);
  if (!href) return;
  const { width, height } = getCanvasDimensions(state);
  parts.push(
    `<image href="${href}" x="0" y="0" width="${width}" height="${height}" />`
  );
}

async function vectorMarkupByLayer(
  state: EditorState
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  for (const layer of state.layers) {
    if (layer.type !== "image" || !layer.visible) continue;
    if (layer.bw || !isLocalVectorSrc(layer.src) || !isFullImageCrop(layer)) {
      continue;
    }
    const text = await loadSvgText(layer.src);
    if (!text) continue;
    const markup = imageLayerSvgMarkup(layer, text);
    if (markup) out.set(layer.id, markup);
  }
  return out;
}

/** Build an SVG document mirroring the current scene (text + local SVG layers stay vector). */
export async function exportSvg(state: EditorState): Promise<Blob> {
  const { width, height } = getCanvasDimensions(state);
  const ctx = measureCtx();
  const vectors = await vectorMarkupByLayer(state);
  const parts: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<defs><style type="text/css"><![CDATA[@import url('${SVG_FONT_IMPORT}');]]></style></defs>`,
    `<rect width="100%" height="100%" fill="${state.canvasBg}"/>`,
  ];

  let batch: ImageLayer[] = [];
  let basePending = true;
  for (const layer of state.layers) {
    if (layer.type !== "image" || !layer.visible) continue;
    const markup = vectors.get(layer.id);
    if (markup) {
      pushRaster(parts, state, batch, basePending ? "base" : "overlay");
      batch = [];
      basePending = false;
      parts.push(markup);
    } else {
      batch.push(layer);
    }
  }
  pushRaster(parts, state, batch, basePending ? "base" : "overlay");

  for (const layer of state.layers) {
    if (layer.type === "text") {
      parts.push(textLayerSvg(layer, ctx));
    }
  }

  parts.push("</svg>");
  return new Blob([parts.join("\n")], { type: "image/svg+xml;charset=utf-8" });
}
