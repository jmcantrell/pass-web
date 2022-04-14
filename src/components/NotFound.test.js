// @vitest-environment jsdom

import { test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import NotFoundUsage from "./NotFound.usage";

beforeEach(() => {
  document.body.innerHTML = "";
});

test("component renders correctly", () => {
  const { unmount, getByText } = render(NotFoundUsage);
  expect(() => getByText("Resource Not Found")).not.toThrow();
  expect(() => getByText("Page Not Found")).not.toThrow();
  expect(() => getByText("Person Not Found: Jim")).not.toThrow();
  unmount();
});
