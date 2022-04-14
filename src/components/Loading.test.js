// @vitest-environment jsdom

import { test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import LoadingUsage from "./Loading.usage";

beforeEach(() => {
  document.body.innerHTML = "";
});

test("component renders correctly", () => {
  const { unmount, getByText } = render(LoadingUsage);
  expect(() => getByText("Loading...")).not.toThrow();
  expect(() => getByText("Loading stuff...")).not.toThrow();
  expect(() => getByText("Reticulating Splines")).not.toThrow();
  unmount();
});
