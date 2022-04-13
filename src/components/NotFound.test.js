// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import NotFoundUsage from "./NotFound.usage";

test("component renders correctly", () => {
  const { getByText } = render(NotFoundUsage);
  expect(() => getByText("Resource Not Found")).not.toThrow();
  expect(() => getByText("Page Not Found")).not.toThrow();
  expect(() => getByText("Person Not Found: Jim")).not.toThrow();
});
