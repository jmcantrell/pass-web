import { vi, describe, test, expect, beforeEach } from "vitest";
import { default as createProvider, baseURL, version } from "./github";

global.fetch = vi.fn();

let provider;
const repo = "user/project";
const branch = "main";
const token = "fake token";

const pathTrees = "git/trees";
const pathTreesRecursive = `${pathTrees}/${branch}?recursive=1`;
const pathCommits = "git/commits";
const pathRef = `git/ref/heads/${branch}`;
const pathRefs = `git/refs/heads/${branch}`;
const pathContents = (path) => `contents/${path}`;

function expectNextFetch(path, options = {}) {
  if (!options.request) options.request = {};
  if (!options.response) options.response = {};

  if (!options.request.headers) options.request.headers = {};
  options.request.headers.accept = `application/vnd.github.${version}+json`;
  options.request.headers.authorization = `token ${token}`;

  if (options.request.body) {
    options.request.headers["content-type"] = "application/json";
    if (options.request.body.content) {
      options.request.body.content = btoa(options.request.body.content);
    }
    options.request.body = JSON.stringify(options.request.body);
  }

  if (!options.response.status) options.response.status = 200;

  options.response.ok = options.response.status < 400;

  if (!options.response.statusText) options.response.statusText = "fake message";

  const json = options.response.json || {};
  if (json.content) {
    // GitHub splits the content into lines, so to be sure this is handled,
    // throw a newline in the middle.
    const encoded = btoa(json.content);
    const mid = encoded.length / 2;
    json.content = `${encoded.slice(0, mid)}\n${encoded.slice(mid)}`;
  }
  options.response.json = async () => json;

  global.fetch.mockImplementationOnce(async (url, request) => {
    expect(url).toBe(`${baseURL}/repos/${repo}/${path}`);
    expect(request).toEqual(options.request);
    return options.response;
  });
}

beforeEach(() => {
  global.fetch.mockReset();
  provider = createProvider({ repo, branch, token });
});

describe("list", () => {
  test("should return every path recursively", async () => {
    expectNextFetch(pathTreesRecursive, {
      response: {
        json: {
          tree: [
            { path: "file.txt", type: "blob" },
            { path: "ignored", type: "not-blob" },
            { path: "password.gpg", type: "blob" },
            { path: "site/username.gpg", type: "blob" },
          ],
        },
      },
    });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);
  });
});

describe("has", () => {
  const path = "foo.txt";

  test("should return true if path exists", async () => {
    expectNextFetch(pathContents(path), { response: { json: { sha: "only needs to be truthy" } } });
    expect(await provider.has(path)).toBe(true);
  });

  test("should return false if path does not exist", async () => {
    expectNextFetch(pathContents(path), { response: { status: 404 } });
    expect(await provider.has(path)).toBe(false);
  });
});

describe("get", () => {
  const path = "foo.txt";
  const content = "fake content";

  test("should return path content", async () => {
    expectNextFetch(pathContents(path), { response: { json: { content } } });
    expect(await provider.get(path)).toBe(content);
  });
});

describe("set", () => {
  const path = "foo.txt";
  const content = "fake content";
  const message = "fake message";

  test("should add a new file", async () => {
    expectNextFetch(pathContents(path), { response: { status: 404 } });
    expectNextFetch(pathContents(path), {
      request: { method: "PUT", body: { message, content, sha: null } },
    });
    await provider.set(path, content, message);
  });

  test("should update an exising file", async () => {
    const sha = "fake sha";
    expectNextFetch(pathContents(path), { response: { json: { sha } } });
    expectNextFetch(pathContents(path), {
      request: { method: "PUT", body: { message, content, sha } },
    });
    await provider.set(path, content, message);
  });
});

describe("remove", () => {
  const path = "foo.txt";
  const message = "fake message";

  test("should delete the file", async () => {
    const sha = "fake sha";
    expectNextFetch(pathContents(path), { response: { json: { sha } } });
    expectNextFetch(pathContents(path), { request: { method: "DELETE", body: { message, sha } } });
    await provider.remove(path, message);
  });
});

describe("duplicate", () => {
  const from = "foo.txt";
  const to = "bar.txt";
  const content = "fake content";
  const message = "fake message";

  test("should copy the file to a new path", async () => {
    expectNextFetch(pathContents(from), { response: { json: { content } } });
    expectNextFetch(pathContents(to), { response: { status: 404 } });
    expectNextFetch(pathContents(to), {
      request: { method: "PUT", body: { message, content, sha: null } },
    });
    await provider.duplicate(from, to, message);
  });

  test("should overwrite an existing file", async () => {
    const sha = "fake sha";
    expectNextFetch(pathContents(from), { response: { json: { content } } });
    expectNextFetch(pathContents(to), { response: { json: { sha } } });
    expectNextFetch(pathContents(to), {
      request: { method: "PUT", body: { message, content, sha } },
    });
    await provider.duplicate(from, to, message);
  });
});

describe("rename", () => {
  const from = "foo.txt";
  const to = "bar.txt";
  const message = "message";

  test("should move the file to a new path", async () => {
    const shaTree = "fake tree";
    const shaHead = "fake head";
    const shaCommit = "fake commit";
    const tracker = "to make sure it's the same object";
    expectNextFetch(pathTreesRecursive, {
      response: { json: { tree: [{ path: from, type: "blob", tracker }] } },
    });
    expectNextFetch(pathTrees, {
      request: { method: "POST", body: { tree: [{ path: to, type: "blob", tracker }] } },
      response: { json: { sha: shaTree } },
    });
    expectNextFetch(pathRef, { response: { json: { object: { sha: shaHead } } } });
    expectNextFetch(pathCommits, {
      request: { method: "POST", body: { message, tree: shaTree, parents: [shaHead] } },
      response: { json: { sha: shaCommit } },
    });
    expectNextFetch(pathRefs, { request: { method: "PATCH", body: { sha: shaCommit } } });
    await provider.rename(from, to, message);
  });

  test("should overwrite an existing file", async () => {
    const shaTree = "fake tree";
    const shaHead = "fake head";
    const shaCommit = "fake commit";
    const tracker = "to make sure it's the same object";
    expectNextFetch(pathTreesRecursive, {
      response: {
        json: {
          tree: [
            { path: from, type: "blob", tracker },
            { path: to, type: "blob" },
          ],
        },
      },
    });
    expectNextFetch(pathTrees, {
      request: { method: "POST", body: { tree: [{ path: to, type: "blob", tracker }] } },
      response: { json: { sha: shaTree } },
    });
    expectNextFetch(pathRef, { response: { json: { object: { sha: shaHead } } } });
    expectNextFetch(pathCommits, {
      request: { method: "POST", body: { message, tree: shaTree, parents: [shaHead] } },
      response: { json: { sha: shaCommit } },
    });
    expectNextFetch(pathRefs, { request: { method: "PATCH", body: { sha: shaCommit } } });
    await provider.rename(from, to, message);
  });
});
