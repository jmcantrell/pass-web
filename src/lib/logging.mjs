import { name } from "@/lib/app";

export function debug(...args) {
	console.debug(name, ...args);
}

export function info(...args) {
	console.info(name, ...args);
}
