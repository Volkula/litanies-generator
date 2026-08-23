export interface BannerDef {
  id: string;
  label: string;
  file: string;
}

/** Vector banners traced from the supplied outline PNGs. */
export const BANNER_LIBRARY: BannerDef[] = [
  { id: "set1-1", label: "Set 1 — Banner 1", file: "frames/banner-set1-1.svg" },
  { id: "set1-2", label: "Set 1 — Banner 2", file: "frames/banner-set1-2.svg" },
  { id: "set1-3", label: "Set 1 — Banner 3", file: "frames/banner-set1-3.svg" },
  { id: "set1-4", label: "Set 1 — Banner 4", file: "frames/banner-set1-4.svg" },
  { id: "set2", label: "Set 2 — Tall banner", file: "frames/banner-set2.svg" },
  { id: "set3", label: "Set 3 — Tall banner", file: "frames/banner-set3.svg" },
  { id: "set4", label: "Set 4 — Tall banner", file: "frames/banner-set4.svg" },
];
