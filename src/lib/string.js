export function stripStart(s, prefix) {
  while (s.startsWith(prefix)) s = s.slice(prefix.length);
  return s;
}

export function stripEnd(s, suffix) {
  while (s.endsWith(suffix)) s = s.slice(0, -suffix.length);
  return s;
}

export function strip(s, text) {
  return stripStart(stripEnd(s, text), text);
}
