// @vitest-environment jsdom

import { vi, test, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { start, navigate, redirect } from "./router";

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
});

afterAll(() => {
  stop();
});

beforeEach(() => {
  set.mockClear();
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
  });

  test(`${func.name} should choose the route with a parameter`, () => {
    func("/path/123", ...args);
    expect(set).toHaveBeenLastCalledWith({
      component: "path with param",
      params: { id: "123" },
    });
  });

  test(`${func.name} should fall back on unknown uri`, () => {
    func("/bogus", ...args);
    expect(set).toHaveBeenLastCalledWith({
      component: "fallback",
      params: { name: "Page", value: "/bogus" },
    });
  });
}
