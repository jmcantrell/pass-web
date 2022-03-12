import page from "page";
import { baseUrl } from "@/lib/app";

export function objectToQuery(object = {}) {
	const params = new URLSearchParams();
	for (const [key, values] of Object.entries(object)) {
		if (Array.isArray(values)) {
			for (const value of values) {
				params.append(key, value);
			}
		} else {
			params.append(key, values);
		}
	}
	return params;
}

export function ensureQueryIsURLSearchParams(options = {}) {
	if (options.query && !(options.query instanceof URLSearchParams)) {
		options.query = objectToQuery(options.query);
	}
	return options;
}

export function getHref(path, options = {}) {
	options = ensureQueryIsURLSearchParams(options);
	const href = typeof path == "function" ? path(options) : path;
	const query = options.query ? options.query.toString() : "";
	return baseUrl + (query ? `${href}?${query}` : href);
}

export function navigate(path, options = {}) {
	return page(getHref(path, ensureQueryIsURLSearchParams(options)));
}

export function redirect(path, options = {}) {
	return page.redirect(getHref(path, ensureQueryIsURLSearchParams(options)));
}
