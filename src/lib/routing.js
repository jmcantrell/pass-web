import navaid from "navaid";
import rsort from "route-sort";
import { inject } from "regexparam";
import { stripStart, stripEnd } from "@/lib/string";
import { convertObjectToSearchParams } from "@/lib/url";

let router;

const baseUrl = import.meta.env.BASE_URL;

export const start = (routes, fallback, set) => {
  router = navaid(baseUrl, (uri) => {
    set({
      component: fallback,
      params: { name: "Page", value: uri }
    });
  });

  for (const path of rsort(Object.keys(routes))) {
    router.on(path, (params) => {
      set({ component: routes[path], params });
    });
  }

  router.listen();

  return () => {
    router.unlisten();
  };
};

export function getURI(path, options = {}) {
  path = inject(path, options.params || {});
  path = stripEnd(baseUrl, "/") + "/" + stripStart(path, "/");
  const query = convertObjectToSearchParams(options.query || {}).toString();
  return `${path}${query ? "?" + query : ""}`;
}

export const navigate = (path, options = {}) => {
  router.route(getURI(path, options));
};

export const redirect = (path, options = {}) => {
  router.route(getURI(path, options), true);
};
