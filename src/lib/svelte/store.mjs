import { writable } from "svelte/store";
import { debug } from "@/lib/logging";

const noop = () => {};

export function ensureSubscriber(store, callback = noop) {
	store.subscribe(callback);
	return store;
}

export function createLocalStorageStore(name, defaultValue = null) {
	const initial = localStorage.getItem(name);
	const store = writable(initial ? JSON.parse(initial) : defaultValue);

	store.subscribe((value) => {
		debug(`saving ${name} to local storage`);
		localStorage.setItem(name, JSON.stringify(value));
	});

	return store;
}

export function createSettingStore(name, defaultValue = null) {
	const defaultValueSerialized = JSON.stringify(defaultValue);
	const store = createLocalStorageStore(`settings.${name}`, defaultValue);

	store.reset = () => {
		store.set(JSON.parse(defaultValueSerialized));
	};

	return store;
}
