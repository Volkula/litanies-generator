import { FrameState, FrameStyle } from "../types";

export type BorderFrameStyle = Extract<
  FrameStyle,
  "border1" | "border2" | "border3" | "border4"
>;

export type FrameSheetLayout = "grid2x2" | "column4";

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
    label: "Set 1 — Scrolls & parchment",
    file: "frames/border_1.png",
    layout: "grid2x2",
    variants: [
      "Tattered scroll",
      "Hanging banner",
      "Curved scroll",
      "Weathered page",
    ],
  },
  {
    id: "border2",
    label: "Set 2 — Banners & tapestries",
    file: "frames/border_2.png",
    layout: "column4",
    variants: [
      "Horizontal scroll",
      "Tabbed tapestry",
      "Double-scroll pendant",
      "Notched plaque",
    ],
  },
  {
    id: "border3",
    label: "Set 3 — Gothic & imperial",
    file: "frames/border_3.png",
    layout: "column4",
    variants: [
      "Industrial tabbed",
      "Gothic arch",
      "Corner scroll",
      "Ornate imperial",
    ],
  },
  {
    id: "border4",
    label: "Set 4 — Hanging banners",
    file: "frames/border_4.png",
    layout: "column4",
    variants: [
      "Rod scroll",
      "Pointed banner",
      "Battle-worn scroll",
      "Swallowtail",
    ],
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
  if (layout === "grid2x2") {
    const cw = w / 2;
    const ch = h / 2;
    const col = v % 2;
    const row = Math.floor(v / 2);
    return { sx: col * cw, sy: row * ch, sw: cw, sh: ch };
  }
  const ch = h / 4;
  return { sx: 0, sy: v * ch, sw: w, sh: ch };
}

export function normalizedFrameScale(frame: FrameState): number {
  return frame.frameScale ?? 1;
}

export function normalizedFrameVariant(frame: FrameState): number {
  return Math.max(0, Math.min(3, frame.frameVariant ?? 0));
}

export function preloadFrameSheets(onReady?: () => void) {
  for (const sheet of FRAME_SHEETS) {
    const img = new Image();
    img.onload = () => onReady?.();
    img.src = frameSheetUrl(sheet);
  }
}
