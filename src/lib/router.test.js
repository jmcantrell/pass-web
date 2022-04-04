// @vitest-environment jsdom

import { vi, test, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { start, navigate, redirect } from "./router";

vi.mock("navaid", async () => {
  const navaid = (await vi.importActual("navaid")).default;

  return {
    default: vi.fn((base, on404) => {
      router = navaid(base, on404);
      const actualListen = router.listen;
      router.spy = {
        on: vi.spyOn(router, "on"),
        route: vi.spyOn(router, "route"),
        listen: vi.spyOn(router, "listen").mockImplementation(() => {
          actualListen();
          router.spy.unlisten = vi.spyOn(router, "unlisten");
        }),
      };
      router.mockClear = () => {
        for (const key of Object.keys(router.spy)) {
          router.spy[key].mockClear();
        }
      };
      return router;
    }),
  };
});

let router;
const set = vi.fn();

const routes = {
  "/": "home",
  "/path": "path",
  "/path/:id": "path with param",
};

const fallback = "fallback";

let stop;

beforeAll(() => {
  stop = start(routes, fallback, set);
  expect(router.spy.listen).toHaveBeenCalled();
});

afterAll(() => {
  stop();
  expect(router.spy.unlisten).toHaveBeenCalled();
});

beforeEach(() => {
  set.mockClear();
  router.mockClear();
});

const cases = [
  [navigate, []],
  [redirect, [true]],
];

for (const [func, args] of cases) {
  test(`${func.name} should choose the simple route`, () => {
    func("/path", ...args);
    expect(set).toHaveBeenLastCalledWith({
      component: "path",
      params: {},
    });
    expect(router.spy.route).toHaveBeenLastCalledWith("/test/path", ...args);
  });

  test(`${func.name} should choose the route with a parameter`, () => {
    func("/path/123", ...args);
    expect(set).toHaveBeenLastCalledWith({
      component: "path with param",
      params: { id: "123" },
    });
    expect(router.spy.route).toHaveBeenLastCalledWith("/test/path/123", ...args);
  });

  test(`${func.name} should fall back on unknown uri`, () => {
    func("/bogus", ...args);
    expect(set).toHaveBeenLastCalledWith({
      component: "fallback",
      params: { name: "Page", value: "/bogus" },
    });
    expect(router.spy.route).toHaveBeenLastCalledWith("/test/bogus", ...args);
  });
}
