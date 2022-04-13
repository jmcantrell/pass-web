// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import EnsureStoreUsage from "./EnsureStore.usage";

test("component renders correctly", () => {
  const { getByText } = render(EnsureStoreUsage);
  expect(() => getByText("Should Not Be Visible")).toThrow();
  expect(() => getByText("Store Not Found: bogus")).not.toThrow();
  expect(() => getByText("Store Exists")).not.toThrow();
});
