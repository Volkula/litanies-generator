import { BANNER_LIBRARY } from "../data/bannerLibrary";
import { iconUrl } from "../lib/icons";

interface Props {
  onAdd: (file: string, label: string) => void;
}

export default function BannerLibrary({ onAdd }: Props) {
  return (
    <div className="section">
      <h3 className="section-title">Banners ({BANNER_LIBRARY.length})</h3>
      <p className="muted">
        Click to add a vector banner as a layer — move, scale, and stack it like
        an icon. SVG export keeps the outline as paths.
      </p>
      <div className="icon-grid banner-grid">
        {BANNER_LIBRARY.map((banner) => (
          <button
            key={banner.id}
            className="icon-tile banner-tile"
            title={`${banner.label}\nClick to add as a layer`}
            onClick={() => onAdd(banner.file, banner.label)}
          >
            <img src={iconUrl(banner.file)} alt={banner.label} loading="lazy" />
            <span className="icon-label">{banner.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
