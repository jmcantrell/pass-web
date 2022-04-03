import { stripEnd } from "@/lib/string";

const sep = "/";

export function basename(path) {
  const parts = stripEnd(path, sep).split(sep);
  return parts[parts.length - 1];
}

export function extname(path) {
  const parts = basename(path).split(".");
  return parts.length > 1 ? "." + parts[parts.length - 1] : "";
}

export function rootname(path) {
  const base = basename(path);
  return stripEnd(base, extname(base));
}
