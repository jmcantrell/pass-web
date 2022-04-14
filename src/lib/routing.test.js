import { describe, test, expect } from "vitest";
import { getURI } from "./routing";

describe("getting a formatted uri", () => {
  test("should include base url", () => {
    const baseURL = import.meta.env.BASE_URL;
    import.meta.env.BASE_URL = "/test/";
    expect(getURI("foo")).toBe("/test/foo");
    import.meta.env.BASE_URL = baseURL;
  });

  test("should normalize paths", () => {
    const expected = "/foo";
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
    const expected = "/foo/123/stuff/path/to/file.txt";
    expect(getURI(path, { params })).toBe(expected);
  });

  test("should append a given query", () => {
    const query = {
      a: 1,
      b: true,
      c: "stuff",
    };
    const expected = "/foo?a=1&b=true&c=stuff";
    expect(getURI("foo", { query })).toBe(expected);
  });
});
