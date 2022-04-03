export function stripStart(s, prefix) {
  return s.startsWith(prefix) ? s.slice(prefix.length) : s;
}

export function stripEnd(s, suffix) {
  return s.endsWith(suffix) ? s.slice(0, -suffix.length) : s;
}

export function strip(s, text) {
  return stripStart(stripEnd(s, text), text);
}
