import { derived } from "svelte/store";
import { ensureSubscriber } from "@/lib/svelte/store";
import createStore from "@/lib/store";
import * as sourceAPIs from "@/lib/sources/apis";
import sources from "@/local/sources";
import cryptors from "@/local/cryptors";

export default ensureSubscriber(
	derived([cryptors, sources], ([$cryptors, $sources]) => {
		return Object.fromEntries(
			Object.entries($sources).map(([name, { type, key, options }]) => {
				const cryptor = $cryptors[key];
				const api = sourceAPIs[type](options);
				return [name, createStore({ api, cryptor })];
			})
		);
	}),
	() => {
		console.debug("derived stores");
	}
);
