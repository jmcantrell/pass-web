import { vi, describe, test, expect, beforeEach } from "vitest";
import { FetchError } from "@/lib/error";
import { default as createProvider, baseURL, maxPerPage } from "./gitlab";

global.fetch = vi.fn();

let provider;
const repo = "user/project";
const branch = "main";
const token = "fake token";

function queueFetchSuccess(response = {}) {
  const json = response.json || {};
  response.ok = true;
  response.json = async () => json;
  response.headers = new Map(Object.entries(response.headers || {}));
  global.fetch.mockImplementationOnce(async () => response);
}

function queueFetchError(response = {}) {
  response.ok = false;
  global.fetch.mockImplementationOnce(async () => response);
}

function getRequestURL(path) {
  return `${baseURL}/projects/${encodeURIComponent(repo)}/repository/${path}`;
}

function expectFetch(expectedPath, expectedPayload = {}) {
  const [url, payload] = global.fetch.calls.shift();
  expect(url).toBe(getRequestURL(expectedPath));
  if (!expectedPayload.headers) expectedPayload.headers = {};
  expectedPayload.headers.authorization = `Bearer ${token}`;
  if (expectedPayload.body) {
    expectedPayload.headers["content-type"] = "application/json";
    expectedPayload.body = JSON.stringify(expectedPayload.body);
  }
  expect(payload).toEqual(expectedPayload);
}

function expectFetchFiles(expectedPath, expectedPayload = {}) {
  expectFetch(`files/${encodeURIComponent(expectedPath)}?ref=${branch}`, expectedPayload);
}

function expectFetchTree(expectedPayload = {}) {
  expectFetch(`tree?recursive=1&pagination=keyset&per_page=${maxPerPage}`, expectedPayload);
}

function expectFetchCommits(expectedPayload = {}) {
  expectFetch(`commits/${branch}`, expectedPayload);
}

async function expectFetchError(promise, response) {
  await expect(promise).rejects.toThrow(new FetchError(response));
}

function testFetchError(callback) {
  test("should throw a fetch error if response is not ok", async () => {
    const response = { status: 400, statusText: "oops" };
    queueFetchError(response);
    await expectFetchError(callback(), response);
  });
}

beforeEach(() => {
  global.fetch.mockReset();
  provider = createProvider({ repo, branch, token });
});

function getLinkHeader(page, total) {
  const getFakeURL = (n) => getRequestURL(`fake?page=${n}`);
  const getFakePart = (n, key) => `<${getFakeURL(n)}>; rel="${key}"`;

  const parts = [getFakePart(1, "first"), getFakePart(total, "last")];

  if (page > 1) parts.push(getFakePart(page - 1, "prev"));
  if (page < total) parts.push(getFakePart(page + 1, "next"));

  return parts.join(", ");
}

describe("list", () => {
  test("should return every path recursively", async () => {
    queueFetchSuccess({ json: { created_at: "2000-01-01T00:00:00" } });
    queueFetchSuccess({
      headers: { link: getLinkHeader(1, 1) },
      json: [
        { path: "file.txt", type: "blob" },
        { path: "ignored", type: "not-blob" }, // and skip nodes that are not blobs
        { path: "password.gpg", type: "blob" },
        { path: "site/username.gpg", type: "blob" },
      ],
    });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);
    expectFetchCommits();
    expectFetchTree();
  });

  test("should get every page available", async () => {
    const total = 10;
    const expectedResult = [];
    queueFetchSuccess({ json: { created_at: "2000-01-01T00:00:00" } });
    for (let i = 0; i < total; i++) {
      const json = [];
      for (let j = 0; j < maxPerPage; j++) {
        const path = `file${i * maxPerPage + j + 1}.gpg`;
        json.push({ path, type: "blob" });
        expectedResult.push(path);
      }
      queueFetchSuccess({ headers: { link: getLinkHeader(i + 1, total) }, json });
    }
    expect(await provider.list()).toEqual(expectedResult);
    expectFetchCommits();
    expectFetchTree();
    for (let page = 2; page <= total; page++) {
      expectFetch(`fake?page=${page}`);
    }
  });

  test("should use cached list if nothing committed since last fetch", async () => {
    let created_at = "2000-01-01T00:00:00";
    queueFetchSuccess({ json: { created_at } });
    queueFetchSuccess({
      headers: { link: getLinkHeader(1, 1) },
      json: [
        { path: "file.txt", type: "blob" },
        { path: "ignored", type: "not-blob" }, // and skip nodes that are not blobs
        { path: "password.gpg", type: "blob" },
        { path: "site/username.gpg", type: "blob" },
      ],
    });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);
    expectFetchCommits();
    expectFetchTree();

    // Same latest commit date, so no further requests are made.
    // No fetch queued up, so it would error otherwise.
    queueFetchSuccess({ json: { created_at } });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);
    expectFetchCommits();
    expect(global.fetch.calls.length).toBe(0); // Just to emphasize.

    // Simulate commit one second later.
    queueFetchSuccess({ json: { created_at: "2000-01-01T00:00:01" } });
    queueFetchSuccess({
      headers: { link: getLinkHeader(1, 1) },
      json: [
        { path: "password.gpg", type: "blob" },
        { path: "password2.gpg", type: "blob" },
      ],
    });
    expect(await provider.list()).toEqual(["password.gpg", "password2.gpg"]);
    expectFetchCommits();
    expectFetchTree();
  });

  testFetchError(() => provider.list());
});

describe("has", () => {
  const path = "fake.txt";

  test("should return true if path exists", async () => {
    queueFetchSuccess();
    expect(await provider.has(path)).toBe(true);
    expectFetchFiles(path, { method: "HEAD" });
  });

  test("should return false if path does not exist", async () => {
    queueFetchError({ status: 404, statusText: "not found" });
    expect(await provider.has(path)).toBe(false);
    expectFetchFiles(path, { method: "HEAD" });
  });

  testFetchError(() => provider.has(path));
});

describe("get", () => {
  const path = "file.txt";
  const content = "fake content";

  test("should return path content", async () => {
    queueFetchSuccess({ json: { content: btoa(content) } });
    expect(await provider.get(path)).toBe(content);
    expectFetchFiles(path);
  });

  testFetchError(() => provider.get(path));
});

describe("set", () => {
  const path = "file.txt";
  const content = "fake content";
  const commit_message = "fake set";

  test("should add a new file", async () => {
    queueFetchError({ status: 404, statusText: "not found" });
    queueFetchSuccess();
    await provider.set(path, content, commit_message);
    expectFetchFiles(path, { method: "HEAD" });
    expectFetchFiles(path, { method: "POST", body: { branch, content, commit_message } });
  });

  test("should update an exising file", async () => {
    queueFetchSuccess();
    queueFetchSuccess();
    await provider.set(path, content, commit_message);
    expectFetchFiles(path, { method: "HEAD" });
    expectFetchFiles(path, { method: "PUT", body: { branch, content, commit_message } });
  });

  testFetchError(() => provider.set(path, content, commit_message));
});

describe("remove", () => {
  const path = "file.txt";
  const commit_message = "fake remove";

  test("should delete the file", async () => {
    queueFetchSuccess();
    await provider.remove(path, commit_message);
    expectFetchFiles(path, { method: "DELETE", body: { branch, commit_message } });
  });

  testFetchError(() => provider.remove(path, commit_message));
});

describe("duplicate", () => {
  const from = "file1.txt";
  const to = "file2.txt";
  const content = "fake content";
  const commit_message = "fake duplicate";

  test("should copy the file to a new path", async () => {
    queueFetchSuccess({ json: { content: btoa(content) } });
    queueFetchError({ status: 404, statusText: "not found" });
    queueFetchSuccess();
    await provider.duplicate(from, to, commit_message);
    expectFetchFiles(from);
    expectFetchFiles(to, { method: "HEAD" });
    expectFetchFiles(to, { method: "POST", body: { branch, content, commit_message } });
  });

  test("should overwrite an existing file", async () => {
    queueFetchSuccess({ json: { content: btoa(content) } });
    queueFetchSuccess();
    queueFetchSuccess();
    await provider.duplicate(from, to, commit_message);
    expectFetchFiles(from);
    expectFetchFiles(to, { method: "HEAD" });
    expectFetchFiles(to, { method: "PUT", body: { branch, content, commit_message } });
  });

  testFetchError(() => provider.duplicate(from, to, commit_message));
});

describe("rename", () => {
  const from = "file1.txt";
  const to = "file2.txt";
  const commit_message = "fake rename";

  test("should move the file", async () => {
    queueFetchSuccess();
    await provider.rename(from, to, commit_message);
    expectFetch("commits", {
      method: "POST",
      body: {
        branch,
        commit_message,
        actions: [{ action: "move", file_path: to, previous_path: from }],
      },
    });
  });

  testFetchError(() => provider.rename(from, to, commit_message));
});
