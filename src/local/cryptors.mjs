import { derived } from "svelte/store";
import { ensureSubscriber } from "@/lib/svelte/store";
import { debug } from "@/lib/logging";
import createCryptor from "@/lib/cryptor";
import keys from "@/local/keys";

export default ensureSubscriber(
	derived(keys, ($keys) => {
		return Object.fromEntries(
			Object.entries($keys).map(([keyName, key]) => {
				return [keyName, createCryptor(key.options)];
			})
		);
	}),
	() => {
		debug("derived cryptors");
	}
);
