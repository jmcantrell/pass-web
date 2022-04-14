// @vitest-environment jsdom

import { test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import ErrorUsage from "./Error.usage";

beforeEach(() => {
  document.body.innerHTML = "";
});

test("component renders correctly", () => {
  const { unmount, getByText } = render(ErrorUsage);
  expect(() => getByText("BOOM!")).not.toThrow();
  unmount();
});
