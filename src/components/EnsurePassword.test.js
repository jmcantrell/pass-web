// @vitest-environment jsdom

import { vi, test, expect, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";
import EnsurePasswordUsage from "./EnsurePassword.usage";

vi.mock("@/local/stores", () => {
  return {
    default: {
      subscribe: (callback) => {
        callback({
          foo: {
            has: (name) => {
              if (name == "bogus") return false;
              if (name == "bar") return true;
              return new Promise(() => {});
            },
          },
        });
        return () => {};
      },
    },
  };
});

beforeEach(() => {
  document.body.innerHTML = "";
});

test("component renders correctly", () => {
  const { unmount, getByText } = render(EnsurePasswordUsage);
  expect(() => getByText("Should Not Be Visible")).toThrow();
  expect(() => getByText("Store Not Found: bogus")).not.toThrow();
  expect(() => getByText("Password Not Found: foo/bogus")).not.toThrow();
  expect(() => getByText("Loading password...")).not.toThrow();
  expect(() => getByText("Password Exists")).not.toThrow();
  unmount();
});
