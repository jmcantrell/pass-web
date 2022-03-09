import page from "page";

const baseUrl = process.env.BASE_URL;

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

export function getPath(route, options = {}) {
	options = ensureQueryIsURLSearchParams(options);

	let path = "";
	if (route.path) {
		if (typeof route.path == "function") {
			path = route.path(options);
		} else {
			path = route.path;
		}
	}

	const query = options.query ? options.query.toString() : "";
	return baseUrl + (query ? `${path}?${query}` : path);
}

export function currentPath() {
	const path = window.location.pathname;
	return path.startsWith(baseUrl) ? path.slice(baseUrl.length + 1) : path;
}

export function getTitle(route, options = {}) {
	options = ensureQueryIsURLSearchParams(options);

	if (route.title) {
		if (typeof route.title == "function") {
			return route.title(options);
		} else {
			return route.title;
		}
	} else {
		return route.path;
	}
}

export function navigate(route, options = {}) {
	return page(getPath(route, ensureQueryIsURLSearchParams(options)));
}

export function redirect(route, options = {}) {
	return page.redirect(getPath(route, ensureQueryIsURLSearchParams(options)));
}
