// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { convertObjectToSearchParams } from "@/lib/url";
import LinkUsage from "./Link.usage";

const path = "path";

function testLink(a, options = {}) {
  const url = new URL(a.href);
  const search = convertObjectToSearchParams(options.query || {});
  expect(url.pathname).toBe(`/test/${options.path || path}`);
  expect(url.search.slice(1)).toBe(search.toString());
}

test("links render correctly", () => {
  const { getByText } = render(LinkUsage, { path });
  testLink(getByText(`/test/${path}`));
  testLink(getByText("Simple"));
  testLink(getByText("With Query"), { query: { foo: 1, bar: "a" } });
});
