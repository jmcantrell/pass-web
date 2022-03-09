import { writable } from "svelte/store";

const noop = () => {};

export function ensureSubscriber(store, callback = noop) {
	store.subscribe(callback);
	return store;
}

export function createLocalStorageStore(name, defaultValue = null) {
	const initial = localStorage.getItem(name);
	const store = writable(initial ? JSON.parse(initial) : defaultValue);

	store.subscribe((value) => {
		console.debug(`${name} created`);
		localStorage.setItem(name, JSON.stringify(value));
	});

	return store;
}
