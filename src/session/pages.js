import { getURI } from "@/lib/routing";
import { createSessionStorageStore } from "@/lib/svelte/store";

export default function (initial, path, options = {}) {
  return createSessionStorageStore(`page:${getURI(path, options)}`, { initial });
}
