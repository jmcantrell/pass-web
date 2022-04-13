// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import EnsureKeyUsage from "./EnsureKey.usage";

test("component renders correctly", () => {
  const { getByText } = render(EnsureKeyUsage);
  expect(() => getByText("Should Not Be Visible")).toThrow();
  expect(() => getByText("Key Not Found: bogus")).not.toThrow();
  expect(() => getByText("Key Exists")).not.toThrow();
});
