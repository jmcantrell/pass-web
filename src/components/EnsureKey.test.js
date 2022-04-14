// @vitest-environment jsdom

import { vi, test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import EnsureKeyUsage from "./EnsureKey.usage";

vi.mock("@/local/keys", () => {
  return {
    default: {
      subscribe: (callback) => {
        callback({ foo: "value is not used" });
        return () => {};
      },
    },
  };
});

beforeEach(() => {
  document.body.innerHTML = "";
});

test("component renders correctly", () => {
  const { unmount, getByText } = render(EnsureKeyUsage);
  expect(() => getByText("Should Not Be Visible")).toThrow();
  expect(() => getByText("Key Not Found: bogus")).not.toThrow();
  expect(() => getByText("Key Exists")).not.toThrow();
  unmount();
});
