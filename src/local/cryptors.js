import { derived } from "svelte/store";
import createCryptor from "@/lib/cryptor";
import keys from "@/local/keys";

export default derived(keys, ($keys) => {
  return Object.fromEntries(
    Object.entries($keys).map(([name, key]) => {
      return [name, createCryptor(key)];
    })
  );
});
