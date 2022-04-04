import { inject } from "regexparam";
import { strip, stripEnd } from "@/lib/string";
import { convertObjectToSearchParams } from "@/lib/url";

export function getURI(path, options = {}) {
  path = inject(path, options.params || {});
  path = stripEnd(import.meta.env.BASE_URL, "/") + "/" + strip(path, "/");
  const query = convertObjectToSearchParams(options.query || {}).toString();
  return `${path}${query ? "?" + query : ""}`;
}
