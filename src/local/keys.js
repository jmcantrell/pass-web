import { createLocalStorageStore } from "@/lib/svelte/store";
import schema from "@/schemas/key";

function validate(keys) {
  return Object.fromEntries(
    Object.entries(keys).map(([name, key]) => {
      return [name, schema.validateSync(key)];
    })
  );
}

export default createLocalStorageStore("keys", { defaults: {}, validate });
