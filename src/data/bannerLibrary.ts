export interface BannerDef {
  id: string;
  label: string;
  file: string;
}

/** Four tattered-parchment banners (SVG). Click to add like an icon. */
export const BANNER_LIBRARY: BannerDef[] = [
  { id: "banner-1", label: "Banner 1", file: "frames/banner-1.svg" },
  { id: "banner-2", label: "Banner 2", file: "frames/banner-2.svg" },
  { id: "banner-3", label: "Banner 3", file: "frames/banner-3.svg" },
  { id: "banner-4", label: "Banner 4", file: "frames/banner-4.svg" },
];
