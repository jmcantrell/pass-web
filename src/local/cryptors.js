import { derived } from "svelte/store";
import { ensureSubscriber } from "@/lib/svelte/store";
import createCryptor from "@/lib/cryptor";
import keys from "@/local/keys";

export default ensureSubscriber(
  derived(keys, ($keys) => {
    return Object.fromEntries(
      Object.entries($keys).map(([name, key]) => {
        return [name, createCryptor(key)];
      })
    );
  })
);
