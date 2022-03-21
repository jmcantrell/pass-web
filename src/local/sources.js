import { createLocalStorageStore } from "@/lib/svelte/store";
import schema from "@/schemas/source";

function validate(sources) {
  const keys = JSON.parse(localStorage.getItem("keys") || {});
  return Object.fromEntries(
    Object.entries(sources).map(([name, source]) => {
      return [name, schema.validateSync(source, { context: { keys } })];
    })
  );
}

export default createLocalStorageStore("sources", { defaults: {}, validate });
