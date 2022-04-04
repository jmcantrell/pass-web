import { describe, test, expect } from "vitest";
import { strip, stripStart, stripEnd } from "./string";

describe("when stripping a prefix", () => {
  test("should remove prefix if string starts with it", () => {
    expect(stripStart("abc", "ab")).toBe("c");
  });

  test("should not change string if it does not start with prefix", () => {
    expect(stripStart("abc", "def")).toBe("abc");
  });

  test("should not change string if prefix is not at start", () => {
    expect(stripStart("abc", "bc")).toBe("abc");
  });

  test("should not change string if entire prefix does not match", () => {
    expect(stripStart("abc", "abcd")).toBe("abc");
  });

  test("should remove prefix as much as possible", () => {
    expect(stripStart("aaabc", "a")).toBe("bc");
    expect(stripStart("aaabc", "aa")).toBe("abc");
  });
});

describe("when stripping a suffix", () => {
  test("should remove suffix if string ends with it", () => {
    expect(stripEnd("abc", "bc")).toBe("a");
  });

  test("should not change string if it does not end with suffix", () => {
    expect(stripEnd("abc", "def")).toBe("abc");
  });

  test("should not change string if suffix is not at end", () => {
    expect(stripEnd("abc", "ab")).toBe("abc");
  });

  test("should not change string if entire suffix does not match", () => {
    expect(stripEnd("abc", "bcde")).toBe("abc");
  });

  test("should remove suffix as much as possible", () => {
    expect(stripEnd("abccc", "c")).toBe("ab");
    expect(stripEnd("abccc", "cc")).toBe("abc");
  });
});

describe("when stripping both a prefix and a suffix", () => {
  test("should remove prefix/suffix if string starts and ends with it", () => {
    expect(strip("aaabaa", "a")).toBe("b");
  });
});
