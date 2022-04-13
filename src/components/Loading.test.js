// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import LoadingUsage from "./Loading.usage";

test("component renders correctly", () => {
  const { getByText } = render(LoadingUsage);
  expect(() => getByText("Loading...")).not.toThrow();
  expect(() => getByText("Loading stuff...")).not.toThrow();
  expect(() => getByText("Reticulating Splines")).not.toThrow();
});
