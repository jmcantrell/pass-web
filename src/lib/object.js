export function isPlainObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value !== null;
}
