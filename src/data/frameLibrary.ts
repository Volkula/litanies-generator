import { FrameState, FrameStyle } from "../types";

export type BorderFrameStyle = Extract<
  FrameStyle,
  "border1" | "border2" | "border3" | "border4"
>;

export type FrameSheetLayout = "columns" | "single";

export interface FrameSheetDef {
  id: BorderFrameStyle;
  label: string;
  file: string;
  layout: FrameSheetLayout;
  variants: string[];
}

export const FRAME_SHEETS: FrameSheetDef[] = [
  {
    id: "border1",
    label: "Set 1 — Four banners",
    file: "frames/border_1.png",
    layout: "columns",
    variants: ["Banner 1", "Banner 2", "Banner 3", "Banner 4"],
  },
  {
    id: "border2",
    label: "Set 2 — Tall banner",
    file: "frames/border_2.png",
    layout: "single",
    variants: [],
  },
  {
    id: "border3",
    label: "Set 3 — Tall banner",
    file: "frames/border_3.png",
    layout: "single",
    variants: [],
  },
  {
    id: "border4",
    label: "Set 4 — Tall banner",
    file: "frames/border_4.png",
    layout: "single",
    variants: [],
  },
];

export function isBorderFrameStyle(style: FrameStyle): style is BorderFrameStyle {
  return style.startsWith("border");
}

export function frameSheetForStyle(
  style: FrameStyle
): FrameSheetDef | undefined {
  return FRAME_SHEETS.find((s) => s.id === style);
}

export function frameSheetUrl(sheet: FrameSheetDef): string {
  return `${import.meta.env.BASE_URL}${sheet.file}`;
}

export function frameSheetUrlForStyle(style: BorderFrameStyle): string {
  const sheet = frameSheetForStyle(style);
  return sheet ? frameSheetUrl(sheet) : "";
}

export interface SpriteRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export function variantSpriteRect(
  img: HTMLImageElement,
  layout: FrameSheetLayout,
  variant: number
): SpriteRect {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const v = Math.max(0, Math.min(3, variant));
  if (layout === "single") {
    return { sx: 0, sy: 0, sw: w, sh: h };
  }
  const cw = w / 4;
  return { sx: v * cw, sy: 0, sw: cw, sh: h };
}

export function normalizedFrameScale(frame: FrameState): number {
  return frame.frameScale ?? 1;
}

export function normalizedFrameVariant(
  frame: FrameState,
  count = 4
): number {
  const n = Math.max(1, count);
  return Math.max(0, Math.min(n - 1, frame.frameVariant ?? 0));
}

export function preloadFrameSheets(onReady?: () => void) {
  for (const sheet of FRAME_SHEETS) {
    const img = new Image();
    img.onload = () => onReady?.();
    img.src = frameSheetUrl(sheet);
  }
}
