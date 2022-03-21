import { getHref } from "@/lib/routing";
import { createSessionStorageStore } from "@/lib/svelte/store";

export default function (initial, path, options = {}) {
  return createSessionStorageStore(`page:${getHref(path, options)}`, { initial });
}
