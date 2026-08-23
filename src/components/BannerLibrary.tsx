import { BANNER_LIBRARY } from "../data/bannerLibrary";
import { iconUrl } from "../lib/icons";

interface Props {
  onAdd: (file: string, label: string) => void;
  onBackground: (file: string) => void;
}

export default function BannerLibrary({ onAdd, onBackground }: Props) {
  return (
    <div className="section">
      <h3 className="section-title">Banners ({BANNER_LIBRARY.length})</h3>
      <p className="muted">
        Click to add as a layer. Shift+Click sets it as the background. Move and
        scale like an icon.
      </p>
      <div className="icon-grid banner-grid">
        {BANNER_LIBRARY.map((banner) => (
          <button
            key={banner.id}
            className="icon-tile banner-tile"
            title={`${banner.label}\nClick: add · Shift+Click: set as background`}
            onClick={(e) =>
              e.shiftKey
                ? onBackground(banner.file)
                : onAdd(banner.file, banner.label)
            }
          >
            <img src={iconUrl(banner.file)} alt={banner.label} loading="lazy" />
            <span className="icon-label">{banner.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
