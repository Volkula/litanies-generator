import { Litany } from "../data/litanies";

const KEY = "litanies.customLitanies.v1";
const LEGACY_KEY = "lithania.customLitanies.v1";

function readCustomRaw(): string | null {
  try {
    const current = localStorage.getItem(KEY);
    if (current) return current;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy) return null;
    localStorage.setItem(KEY, legacy);
    localStorage.removeItem(LEGACY_KEY);
    return legacy;
  } catch {
    return null;
  }
}

export function loadCustom(): Litany[] {
  try {
    const raw = readCustomRaw();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isLitany);
  } catch {
    return [];
  }
}

export function saveCustom(list: Litany[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage may be full or disabled */
  }
}

function isLitany(x: unknown): x is Litany {
  const o = x as Record<string, unknown>;
  return (
    !!o &&
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.text === "string"
  );
}

export function makeCustomLitany(input: {
  title: string;
  category: string;
  text: string;
}): Litany {
  return {
    id: `custom-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4)}`,
    title: input.title.trim() || "Untitled",
    category: input.category.trim() || "Custom",
    source: "User dictionary",
    text: input.text,
  };
}

export function exportCustomJson(list: Litany[]): string {
  return JSON.stringify({ version: 1, litanies: list }, null, 2);
}

export function parseImportedJson(raw: string): Litany[] {
  const data = JSON.parse(raw);
  const arr: unknown = Array.isArray(data) ? data : data?.litanies;
  if (!Array.isArray(arr)) throw new Error("No litanies array found in file.");
  const valid = arr.filter(isLitany) as Litany[];
  if (valid.length === 0) throw new Error("File contained no valid litanies.");
  return valid;
}
