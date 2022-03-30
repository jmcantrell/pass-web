import { vi, it, expect, beforeEach } from "vitest";
import initJSDOM from "@/lib/testing/jsdom";
import { copy } from "./clipboard";

beforeEach(() => initJSDOM());

it("should use clipboard api, if it exists", async () => {
  global.navigator.clipboard = { writeText: vi.fn() };
  const expected = "foo";
  await copy(expected);
  expect(global.navigator.clipboard.writeText).toHaveBeenLastCalledWith(expected);
});

it("should error if null selection", async () => {
  global.window.getSelection = vi.fn(() => null);
  await expect(copy("foo")).rejects.toThrow();
});

it("should fall back to execCommand", async () => {
  global.document.execCommand = vi.fn();
  const spy = vi.spyOn(global.document.body, "appendChild");
  const expected = "foo";
  await copy(expected);
  expect(spy.mock.calls[0][0].textContent).toBe(expected);
  expect(global.document.execCommand).toHaveBeenLastCalledWith("copy");
});
