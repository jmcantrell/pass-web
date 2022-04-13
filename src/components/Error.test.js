// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import ErrorUsage from "./Error.usage";

test("component renders correctly", () => {
  const { getByText } = render(ErrorUsage);
  expect(() => getByText("BOOM!")).not.toThrow();
});
