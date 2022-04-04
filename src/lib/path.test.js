import { describe, test, expect } from "vitest";
import { basename, extname, rootname } from "./path";

describe("basename", () => {
  test("should not change a plain filename", () => {
    expect(basename("file.txt")).toBe("file.txt");
  });

  test("should remove directory", () => {
    expect(basename("/path/to/file.txt")).toBe("file.txt");
    expect(basename("./../path/to/file.txt")).toBe("file.txt");
  });
});

describe("extname", () => {
  test("should return the extension", () => {
    expect(extname("/path/to.xyz/file.txt")).toBe(".txt");
  });

  test("should only return the last extension", () => {
    expect(extname("/path/to.xyz/file.txt.gz")).toBe(".gz");
  });

  test("should not return anything if there's no extension", () => {
    expect(extname("/path/to.xyx/file")).toBe("");
  });
});

describe("rootname", () => {
  test("should return the filename without the extension", () => {
    expect(rootname("/path/to/file.txt")).toBe("file");
  });
});
