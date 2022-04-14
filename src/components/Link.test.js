// @vitest-environment jsdom

import { test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import { convertObjectToSearchParams } from "@/lib/url";
import LinkUsage from "./Link.usage";

const path = "/path";

function testLink(a, options = {}) {
  const url = new URL(a.href);
  const search = convertObjectToSearchParams(options.query || {});
  expect(url.pathname).toBe(options.path || path);
  expect(url.search.slice(1)).toBe(search.toString());
}

beforeEach(() => {
  document.body.innerHTML = "";
});

test("component renders correctly", () => {
  const { unmount, getByText } = render(LinkUsage, { path });
  testLink(getByText(path));
  testLink(getByText("Simple"));
  testLink(getByText("With Query"), { query: { foo: 1, bar: "a" } });
  unmount();
});
