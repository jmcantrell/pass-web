import { writable } from "svelte/store";

function createStoreJSON(name, defaultValue = "{}") {
	const store = writable(JSON.parse(localStorage.getItem(name) || defaultValue));

	store.subscribe((value) => {
		localStorage.setItem(name, JSON.stringify(value));
	});

	return store;
}

export const keys = createStoreJSON("keys");
export const sources = createStoreJSON("sources");
