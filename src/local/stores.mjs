import { derived } from "svelte/store";
import { ensureSubscriber } from "@/lib/svelte/store";
import createStore from "@/lib/store";
import * as sourceTypes from "@/lib/sources";
import sources from "@/local/sources";
import cryptors from "@/local/cryptors";

export default ensureSubscriber(
	derived([cryptors, sources], ([$cryptors, $sources]) => {
		return Object.fromEntries(
			Object.entries($sources).map(([name, { type, key, options }]) => {
				const cryptor = $cryptors[key];
				const api = sourceTypes[type].createAPI(options);
				return [name, createStore({ api, cryptor })];
			})
		);
	}),
	() => {
		console.debug("stores created");
	}
);
