import { vi, describe, test, expect, beforeEach } from "vitest";
import { FetchError } from "@/lib/error";
import { default as createProvider, baseURL, version } from "./github";

global.fetch = vi.fn();

let provider;
const repo = "user/project";
const branch = "main";
const token = "fake token";

function setFetchSuccess(json = null) {
  global.fetch.mockImplementationOnce(async () => {
    return { ok: true, json: async () => json };
  });
}

function setFetchGetPath(content) {
  const encoded = btoa(content);
  const half = encoded.length / 2;
  setFetchSuccess({ content: `${encoded.slice(0, half)}\n${encoded.slice(half)}` });
}

function setFetchError(status, statusText) {
  global.fetch.mockImplementationOnce(async () => {
    return { ok: false, status, statusText };
  });
}

function expectFetchRequest(expectedPath, expectedPayload = {}) {
  const [url, payload] = global.fetch.calls.shift();
  expect(url).toBe(`${baseURL}/repos/${repo}/${expectedPath}`);
  if (!expectedPayload.headers) expectedPayload.headers = {};
  expectedPayload.headers.accept = `application/vnd.github.${version}+json`;
  expectedPayload.headers.authorization = `token ${token}`;
  if (expectedPayload.body) expectedPayload.headers["content-type"] = "application/json";
  expect(payload).toEqual(expectedPayload);
}

async function expectFetchError(promise, status, statusText) {
  await expect(promise).rejects.toThrow(new FetchError({ status, statusText }));
}

function testFetchError(callback) {
  test("should throw a fetch error if response is not ok", async () => {
    const status = 400;
    const statusText = "oops";
    setFetchError(status, statusText);
    await expectFetchError(callback(), status, statusText);
  });
}

beforeEach(() => {
  global.fetch.mockReset();
  provider = createProvider({ repo, branch, token });
});

describe("list", () => {
  test("should return every path recursively", async () => {
    setFetchSuccess({
      tree: [
        { path: "file.txt", type: "blob" },
        { path: "ignored", type: "not-blob" },
        { path: "password.gpg", type: "blob" },
        { path: "site/username.gpg", type: "blob" },
      ],
    });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);
    expectFetchRequest(`git/trees/${branch}?recursive=1`);
  });

  testFetchError(() => provider.list());
});

describe("has", () => {
  const path = "foo.txt";

  test("should return true if path exists", async () => {
    setFetchSuccess({ sha: "needs to be truthy" });
    expect(await provider.has(path)).toBe(true);
    expectFetchRequest(`contents/${path}`);
  });

  test("should return false if path does not exist", async () => {
    setFetchError(404, "not found");
    expect(await provider.has(path)).toBe(false);
    expectFetchRequest(`contents/${path}`);
  });

  testFetchError(() => provider.has(path));
});

describe("get", () => {
  const path = "foo.txt";
  const content = "foobar";

  test("should return path content", async () => {
    setFetchGetPath(content);
    expect(await provider.get(path)).toBe(content);
    expectFetchRequest(`contents/${path}`);
  });

  testFetchError(() => provider.get(path));
});

describe("set", () => {
  const path = "foo.txt";
  const content = "content";
  const message = "message";

  test("should add a new file", async () => {
    setFetchError(404, "not found");
    setFetchSuccess();
    await provider.set(path, content, message);
    expectFetchRequest(`contents/${path}`);
    expectFetchRequest(`contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({ message, content: btoa(content), sha: null }),
    });
  });

  test("should update an exising file", async () => {
    const sha = "fake";
    setFetchSuccess({ sha });
    setFetchSuccess();
    await provider.set(path, content, message);
    expectFetchRequest(`contents/${path}`);
    expectFetchRequest(`contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({ message, content: btoa(content), sha }),
    });
  });

  testFetchError(() => provider.set(path, content, message));
});

describe("remove", () => {
  const path = "foo.txt";
  const message = "message";

  test("should delete the file", async () => {
    const sha = "fake";
    setFetchSuccess({ sha });
    setFetchSuccess();
    await provider.remove(path, message);
    expectFetchRequest(`contents/${path}`);
    expectFetchRequest(`contents/${path}`, {
      method: "DELETE",
      body: JSON.stringify({ message, sha }),
    });
  });

  testFetchError(() => provider.remove(path, message));
});

describe("duplicate", () => {
  const from = "foo.txt";
  const to = "bar.txt";
  const content = "content";
  const message = "message";

  test("should copy the file to a new path", async () => {
    setFetchGetPath(content);
    setFetchError(404, "not found");
    setFetchSuccess();
    await provider.duplicate(from, to, message);
    expectFetchRequest(`contents/${from}`);
    expectFetchRequest(`contents/${to}`);
    expectFetchRequest(`contents/${to}`, {
      method: "PUT",
      body: JSON.stringify({ message, content: btoa(content), sha: null }),
    });
  });

  test("should overwrite an existing file", async () => {
    const sha = "fake";
    setFetchGetPath(content);
    setFetchSuccess({ sha });
    setFetchSuccess();
    await provider.duplicate(from, to, message);
    expectFetchRequest(`contents/${from}`);
    expectFetchRequest(`contents/${to}`);
    expectFetchRequest(`contents/${to}`, {
      method: "PUT",
      body: JSON.stringify({ message, content: btoa(content), sha }),
    });
  });

  testFetchError(() => provider.duplicate(from, to, message));
});

describe("rename", () => {
  const from = "foo.txt";
  const to = "bar.txt";
  const message = "message";

  test("should move the file to a new path", async () => {
    const shaTree = "fake tree";
    const shaCommit = "fake commit";
    const shaHead = "fake head";
    const tracker = "to make sure it's the same object";
    setFetchSuccess({ tree: [{ path: from, type: "blob", tracker }] });
    setFetchSuccess({ sha: shaTree });
    setFetchSuccess({ object: { sha: shaHead } });
    setFetchSuccess({ sha: shaCommit });
    setFetchSuccess();
    await provider.rename(from, to, message);
    expectFetchRequest(`git/trees/${branch}?recursive=1`);
    expectFetchRequest("git/trees", {
      method: "POST",
      body: JSON.stringify({ tree: [{ path: to, type: "blob", tracker }] }),
    });
    expectFetchRequest(`git/ref/heads/${branch}`);
    expectFetchRequest("git/commits", {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: shaTree,
        parents: [shaHead],
      }),
    });
    expectFetchRequest(`git/refs/heads/${branch}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: shaCommit }),
    });
  });

  test("should overwrite an existing file", async () => {
    const shaTree = "fake tree";
    const shaCommit = "fake commit";
    const shaHead = "fake head";
    const tracker = "to make sure it's the same object";
    setFetchSuccess({
      tree: [
        { path: from, type: "blob", tracker },
        { path: to, type: "blob" },
      ],
    });
    setFetchSuccess({ sha: shaTree });
    setFetchSuccess({ object: { sha: shaHead } });
    setFetchSuccess({ sha: shaCommit });
    setFetchSuccess();
    await provider.rename(from, to, message);
    expectFetchRequest(`git/trees/${branch}?recursive=1`);
    expectFetchRequest("git/trees", {
      method: "POST",
      body: JSON.stringify({ tree: [{ path: to, type: "blob", tracker }] }),
    });
    expectFetchRequest(`git/ref/heads/${branch}`);
    expectFetchRequest("git/commits", {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: shaTree,
        parents: [shaHead],
      }),
    });
    expectFetchRequest(`git/refs/heads/${branch}`, {
      method: "PATCH",
      body: JSON.stringify({ sha: shaCommit }),
    });
  });

  testFetchError(() => provider.rename(from, to, message));
});
