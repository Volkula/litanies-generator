import { ImageLayer } from "../types";

/** True when `src` is an SVG we can inline on same-origin SVG export. */
export function isLocalVectorSrc(src: string): boolean {
  if (src.startsWith("data:image/svg+xml")) return true;
  const raw = src.split("#")[0].split("?")[0].toLowerCase();
  if (!raw.endsWith(".svg")) return false;
  if (src.startsWith("blob:")) return false;
  try {
    const url = new URL(src, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return true;
  }
}

export function isFullImageCrop(layer: ImageLayer): boolean {
  const cw = layer.cropW > 0 ? layer.cropW : layer.naturalWidth;
  const ch = layer.cropH > 0 ? layer.cropH : layer.naturalHeight;
  return (
    layer.cropX === 0 &&
    layer.cropY === 0 &&
    cw === layer.naturalWidth &&
    ch === layer.naturalHeight
  );
}

export function decodeSvgDataUrl(src: string): string | null {
  const comma = src.indexOf(",");
  if (comma < 0) return null;
  const header = src.slice(0, comma);
  const payload = src.slice(comma + 1);
  try {
    if (/;base64/i.test(header)) return atob(payload);
    return decodeURIComponent(payload);
  } catch {
    return null;
  }
}

export async function loadSvgText(src: string): Promise<string | null> {
  try {
    if (src.startsWith("data:image/svg+xml")) return decodeSvgDataUrl(src);
    const res = await fetch(src);
    if (!res.ok) return null;
    const text = await res.text();
    return text.includes("<svg") ? text : null;
  } catch {
    return null;
  }
}

/** Nested SVG markup placed at the layer box (rotation / flip around centre). */
export function imageLayerSvgMarkup(
  layer: ImageLayer,
  svgText: string
): string | null {
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  if (parsed.querySelector("parsererror")) return null;
  const svg = parsed.documentElement;
  if (svg.localName.toLowerCase() !== "svg") return null;
  svg.querySelectorAll("script, foreignObject").forEach((n) => n.remove());

  const vb =
    svg.getAttribute("viewBox")?.trim() ||
    `0 0 ${layer.naturalWidth} ${layer.naturalHeight}`;
  const serializer = new XMLSerializer();
  let inner = "";
  for (const child of Array.from(svg.childNodes)) {
    inner += serializer.serializeToString(child);
  }
  if (!inner.trim()) return null;

  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;
  const sx = layer.flipX ? -1 : 1;
  const sy = layer.flipY ? -1 : 1;
  const rot = layer.rotation || 0;
  const opacity =
    layer.opacity !== 1 ? ` opacity="${Number(layer.opacity.toFixed(3))}"` : "";
  const xlink = inner.includes("xlink:")
    ? ' xmlns:xlink="http://www.w3.org/1999/xlink"'
    : "";

  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${sx} ${sy})"${opacity}><svg xmlns="http://www.w3.org/2000/svg"${xlink} x="${-layer.width / 2}" y="${-layer.height / 2}" width="${layer.width}" height="${layer.height}" viewBox="${escapeAttr(vb)}" overflow="visible" preserveAspectRatio="none">${inner}</svg></g>`;
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}
