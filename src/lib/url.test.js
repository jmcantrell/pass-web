import { describe, test, expect } from "vitest";
import { convertObjectToSearchParams, convertSearchParamsToObject } from "./url";

describe("converting an object to search parameters", () => {
  test("should produce similar search parameters", () => {
    const object = { foo: "bar", baz: "qux" };
    expect(convertObjectToSearchParams(object).toString()).toBe("foo=bar&baz=qux");
  });

  test("should handle arrays correctly", () => {
    const object = { multiple: ["a", "b"] };
    expect(convertObjectToSearchParams(object).toString()).toBe("multiple=a&multiple=b");
  });
});

describe("converting search parameters to an object", () => {
  test("should produce a similar object", () => {
    const search = new URLSearchParams();
    search.append("foo", "bar");
    search.append("baz", "qux");
    expect(convertSearchParamsToObject(search)).toEqual({ foo: "bar", baz: "qux" });
  });

  test("should produce arrays for keys with multiple values", () => {
    const search = new URLSearchParams();
    search.append("multiple", "a");
    search.append("multiple", "b");
    expect(convertSearchParamsToObject(search)).toEqual({ multiple: ["a", "b"] });
  });
});
