// @vitest-environment jsdom

import { test, expect } from "vitest";
import { render } from "@testing-library/svelte";
import EnsurePasswordUsage from "./EnsurePassword.usage";

test("component renders correctly", () => {
  const { getByText } = render(EnsurePasswordUsage);
  expect(() => getByText("Should Not Be Visible")).toThrow();
  expect(() => getByText("Store Not Found: bogus")).not.toThrow();
  expect(() => getByText("Password Not Found: foo/bogus")).not.toThrow();
  expect(() => getByText("Loading password...")).not.toThrow();
  expect(() => getByText("Password Exists")).not.toThrow();
});
