import { describe, test, expect } from "vitest";
import { getURI } from "./routing";

describe("getting a formatted uri", () => {
  test("should normalize paths", () => {
    const expected = "/test/foo";
    const paths = ["foo", "/foo", "/foo/", "foo/"];
    for (const path of paths) {
      expect(getURI(path)).toBe(expected);
    }
  });

  test("should inject parameters", () => {
    const params = {
      id: 123,
      name: "stuff",
      wild: "path/to/file.txt",
    };
    const path = "foo/:id/:name/*";
    const expected = "/test/foo/123/stuff/path/to/file.txt";
    expect(getURI(path, { params })).toBe(expected);
  });

  test("should append a given query", () => {
    const query = {
      a: 1,
      b: true,
      c: "stuff",
    };
    const expected = "/test/foo?a=1&b=true&c=stuff";
    expect(getURI("foo", { query })).toBe(expected);
  });
});
