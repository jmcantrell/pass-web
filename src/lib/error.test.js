import { describe, test, expect } from "vitest";
import { FetchError } from "./error";

describe("fetch errors", () => {
  test("should contain and represent the response", () => {
    const status = 404;
    const statusText = "not found";
    const response = { status, statusText };
    const error = new FetchError(response);
    expect(error.message).toMatch(new RegExp(status));
    expect(error.message).toMatch(new RegExp(statusText));
    expect(error.response).toBe(response);
  });
});
