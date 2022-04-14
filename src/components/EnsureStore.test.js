// @vitest-environment jsdom

import { vi, test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import EnsureStoreUsage from "./EnsureStore.usage";

vi.mock("@/local/stores", () => {
  return {
    default: {
      subscribe: (callback) => {
        callback({ foo: "a" });
        return () => {};
      },
    },
  };
});

beforeEach(() => {
  document.body.innerHTML = "";
});

test("component renders correctly", () => {
  const { unmount, getByText } = render(EnsureStoreUsage);
  expect(() => getByText("Should Not Be Visible")).toThrow();
  expect(() => getByText("Store Not Found: bogus")).not.toThrow();
  expect(() => getByText("Store Exists")).not.toThrow();
  unmount();
});
