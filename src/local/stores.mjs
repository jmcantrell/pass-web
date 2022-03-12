import { derived } from "svelte/store";
import { ensureSubscriber } from "@/lib/svelte/store";
import { debug } from "@/lib/logging";
import createStore from "@/lib/store";
import * as hostAPIs from "@/lib/hosts/apis";
import sources from "@/local/sources";
import cryptors from "@/local/cryptors";

export default ensureSubscriber(
	derived([cryptors, sources], ([$cryptors, $sources]) => {
		return Object.fromEntries(
			Object.entries($sources).map(([name, { host, key, options }]) => {
				const cryptor = $cryptors[key];
				const api = hostAPIs[host](options);
				return [name, createStore({ api, cryptor })];
			})
		);
	}),
	() => {
		debug("derived stores");
	}
);
