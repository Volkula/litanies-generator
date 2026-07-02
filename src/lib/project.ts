import { DEFAULT_CANVAS_SIZE, EditorState, createInitialState } from "../types";

const AUTOSAVE_KEY = "litanies.project.autosave.v1";
const LEGACY_AUTOSAVE_KEY = "lithania.project.autosave.v1";

export interface ProjectFile {
  app: "litanies-generator";
  version: 1;
  state: EditorState;
}

export function serializeProject(state: EditorState): string {
  const file: ProjectFile = {
    app: "litanies-generator",
    version: 1,
    state: { ...state, selectedId: null },
  };
  return JSON.stringify(file, null, 2);
}

export function parseProject(raw: string): EditorState {
  const data = JSON.parse(raw);
  const app = data?.app as string | undefined;
  if (app && app !== "litanies-generator" && app !== "lithania-generator") {
    throw new Error("Invalid project file.");
  }
  const state = (data?.state ?? data) as Partial<EditorState>;
  if (!state || !Array.isArray(state.layers)) {
    throw new Error("Invalid project file.");
  }
  // Merge over defaults so older/newer files stay loadable.
  const base = createInitialState();
  return {
    ...base,
    ...state,
    canvasWidth: state.canvasWidth ?? DEFAULT_CANVAS_SIZE,
    canvasHeight: state.canvasHeight ?? DEFAULT_CANVAS_SIZE,
    projectName: state.projectName?.trim() || "Untitled litany",
    selectedId: null,
  } as EditorState;
}

function readAutosaveRaw(): string | null {
  try {
    const current = localStorage.getItem(AUTOSAVE_KEY);
    if (current) return current;
    const legacy = localStorage.getItem(LEGACY_AUTOSAVE_KEY);
    if (!legacy) return null;
    localStorage.setItem(AUTOSAVE_KEY, legacy);
    localStorage.removeItem(LEGACY_AUTOSAVE_KEY);
    return legacy;
  } catch {
    return null;
  }
}

export function saveAutosave(state: EditorState) {
  try {
    localStorage.setItem(AUTOSAVE_KEY, serializeProject(state));
  } catch {
    /* ignore */
  }
}

export function loadAutosave(): EditorState | null {
  try {
    const raw = readAutosaveRaw();
    if (!raw) return null;
    return parseProject(raw);
  } catch {
    return null;
  }
}
