import JSZip from "jszip";
import { EditorState, Layer } from "../types";
import { getCanvasDimensions } from "./canvasSize";
import { drawFrame, drawScene } from "./render";
import { renderToCanvas } from "./exportImage";

/** Render an arbitrary subset of layers onto a transparent canvas. */
function renderLayers(
  state: EditorState,
  layers: Layer[],
  opts: { withBackground?: boolean } = {}
): HTMLCanvasElement {
  const { width, height } = getCanvasDimensions(state);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const subState: EditorState = {
    ...state,
    layers,
    background: opts.withBackground
      ? state.background
      : { ...state.background, src: null },
    frame: { ...state.frame, enabled: false },
    selectedId: null,
  };
  drawScene(ctx, subState, { includeFrame: false, transparent: true });
  return canvas;
}

function renderFrameOnly(state: EditorState): HTMLCanvasElement | null {
  if (!state.frame.enabled) return null;
  const { width, height } = getCanvasDimensions(state);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  drawFrame(ctx, state);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      "image/png"
    );
  });
}

function safeName(name: string, fallback: string): string {
  const cleaned = name
    .trim()
    .replace(/[^\w.-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48);
  return cleaned || fallback;
}

const PACK_README = `Litanies Generator — asset pack
================================

PNG layers on transparent backgrounds for reassembly.
Canvas size is recorded in manifest.json (canvasWidth × canvasHeight).

Structure:
  composite.png     — flat preview (respects export-with-frame setting)
  text/litany.txt   — all text layers joined
  text/NN_name.txt  — raw text per layer
  text/NN_name.png  — rendered text layer (transparent)
  text/all-text.png — all text layers combined (if multiple)
  images/NN_name.png — each image layer separately
  images/all-images.png — all image layers (if multiple)
  images/background.png — background only (if set)
  images/frame.png    — decorative frame only (if enabled)
  manifest.json     — layer positions + full editor state snapshot

Note: hidden layers are exported as visible PNGs; manifest.json keeps the
original visibility flags from the editor.
`;

/** Asset packs always render every layer/background, even if hidden on canvas. */
function packExportState(state: EditorState): EditorState {
  return {
    ...state,
    layers: state.layers.map((l) => ({ ...l, visible: true })),
    background: { ...state.background, visible: true },
  };
}

/**
 * Build an asset pack as a ZIP: composite, every text/image layer on
 * transparent PNG, raw litany text files, frame/background splits.
 */
export async function exportPack(state: EditorState): Promise<Blob> {
  const exportState = packExportState(state);
  const zip = new JSZip();
  zip.file("README.txt", PACK_README);
  zip.file("composite.png", await canvasToBlob(renderToCanvas(exportState)));

  const textLayers = exportState.layers.filter((l) => l.type === "text");
  const imageLayers = exportState.layers.filter((l) => l.type === "image");

  const textDir = zip.folder("text")!;
  const imageDir = zip.folder("images")!;

  const litany = textLayers
    .map((l) => (l.type === "text" ? l.text : ""))
    .join("\n\n");
  textDir.file("litany.txt", litany || "(no text layers)");

  let n = 0;
  for (const layer of textLayers) {
    n++;
    const base = `${String(n).padStart(2, "0")}_${safeName(layer.name, "text")}`;
    if (layer.type === "text") textDir.file(`${base}.txt`, layer.text);
    textDir.file(
      `${base}.png`,
      await canvasToBlob(renderLayers(exportState, [layer]))
    );
  }
  if (textLayers.length > 1) {
    textDir.file(
      "all-text.png",
      await canvasToBlob(renderLayers(exportState, textLayers))
    );
  }

  let m = 0;
  for (const layer of imageLayers) {
    m++;
    const base = `${String(m).padStart(2, "0")}_${safeName(layer.name, "image")}`;
    imageDir.file(
      `${base}.png`,
      await canvasToBlob(renderLayers(exportState, [layer]))
    );
  }
  if (imageLayers.length > 1) {
    imageDir.file(
      "all-images.png",
      await canvasToBlob(renderLayers(exportState, imageLayers))
    );
  }
  if (state.background.src) {
    imageDir.file(
      "background.png",
      await canvasToBlob(renderLayers(exportState, [], { withBackground: true }))
    );
  }
  const frameCanvas = renderFrameOnly(state);
  if (frameCanvas) {
    imageDir.file("frame.png", await canvasToBlob(frameCanvas));
  }

  zip.file("manifest.json", JSON.stringify(state, null, 2));

  return zip.generateAsync({ type: "blob" });
}
