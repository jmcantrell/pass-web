import { derived } from "svelte/store";
import { ensureSubscriber } from "@/lib/svelte/store";
import createStore from "@/lib/store";
import providers from "@/lib/providers";
import sources from "@/local/sources";
import cryptors from "@/local/cryptors";

export default ensureSubscriber(
  derived([cryptors, sources], ([$cryptors, $sources]) => {
    return Object.fromEntries(
      Object.entries($sources).map(([name, source]) => {
        const cryptor = $cryptors[source.key];
        const provider = providers[source.provider](source);
        return [name, createStore({ provider, cryptor })];
      })
    );
  })
);
