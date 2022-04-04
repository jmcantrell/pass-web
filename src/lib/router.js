import navaid from "navaid";
import rsort from "route-sort";
import { getURI } from "@/lib/routing";

let router;

export const start = (routes, fallback, set) => {
  router = navaid(import.meta.env.BASE_URL, (uri) => {
    set({
      component: fallback,
      params: { name: "Page", value: uri },
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

export const navigate = (path, options = {}) => {
  router.route(getURI(path, options));
};

export const redirect = (path, options = {}) => {
  router.route(getURI(path, options), true);
};
