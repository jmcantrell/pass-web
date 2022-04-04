import { describe, test, expect } from "vitest";
import { isPlainObject } from "./object";

describe("testing for a plain object", () => {
  test("should accept an object literal", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ length: 1, 0: true })).toBe(true);
  });

  test("should accept class instances", () => {
    expect(isPlainObject(new Date())).toBe(true);
    expect(isPlainObject(new Error("test"))).toBe(true);
  });

  test("should reject arrays", () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Array(1))).toBe(false);
  });

  test("should reject primitives", () => {
    const values = [1, 1.234, "test", true];
    for (const value of values) {
      expect(isPlainObject(value)).toBe(false);
    }
  });

  test("should reject null", () => {
    expect(isPlainObject(null)).toBe(false);
  });
});
