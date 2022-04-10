import { vi, describe, test, expect, beforeEach } from "vitest";
import { default as createProvider, baseURL, maxPerPage } from "./gitlab";

global.fetch = vi.fn();

let provider;
const repo = "user/project";
const branch = "main";
const token = "fake token";

const pathCommits = "commits";
const pathCommitsBranch = `commits/${branch}`;
const pathTreeRecursive = `tree?recursive=1&pagination=keyset&per_page=${maxPerPage}`;
const pathFiles = (path) => `files/${encodeURIComponent(path)}?ref=${branch}`;

function getRequestURL(path) {
  return `${baseURL}/projects/${encodeURIComponent(repo)}/repository/${path}`;
}

function getLinkHeader(path, page, total) {
  const getFakeURL = (n) => getRequestURL(`${path}&page=${n}`);
  const getFakePart = (n, key) => `<${getFakeURL(n)}>; rel="${key}"`;

  const parts = [getFakePart(1, "first"), getFakePart(total, "last")];

  if (page > 1) parts.push(getFakePart(page - 1, "prev"));
  if (page < total) parts.push(getFakePart(page + 1, "next"));

  return parts.join(", ");
}

function expectNextFetch(path, options = {}) {
  if (!options.request) options.request = {};
  if (!options.response) options.response = {};

  if (!options.request.headers) options.request.headers = {};
  options.request.headers.authorization = `Bearer ${token}`;

  if (options.request.body) {
    options.request.headers["content-type"] = "application/json";
    options.request.body = JSON.stringify(options.request.body);
  }

  if (!options.response.status) options.response.status = 200;

  options.response.ok = options.response.status < 400;

  if (!options.response.statusText) options.response.statusText = "fake message";

  const json = options.response.json || {};
  if (json.content) json.content = btoa(json.content);
  options.response.json = async () => json;

  if (!options.response.headers) options.response.headers = {};

  if (options.response.headers.link) {
    const { page, total } = options.response.headers.link;
    options.response.headers.link = getLinkHeader(path, page, total);
    if (page > 1) path = `${path}&page=${page}`;
  }

  options.response.headers = new Map(Object.entries(options.response.headers));

  global.fetch.mockImplementationOnce(async (url, request) => {
    expect(url).toBe(getRequestURL(path));
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
    expectNextFetch(pathCommitsBranch, {
      response: { json: { created_at: "2000-01-01T00:00:00" } },
    });
    expectNextFetch(pathTreeRecursive, {
      response: {
        headers: { link: { page: 1, total: 1 } },
        json: [
          { path: "file.txt", type: "blob" },
          { path: "ignored", type: "not-blob" }, // and skip nodes that are not blobs
          { path: "password.gpg", type: "blob" },
          { path: "site/username.gpg", type: "blob" },
        ],
      },
    });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);
  });

  test("should get every page available", async () => {
    const total = 10;
    const expectedResult = [];
    expectNextFetch(pathCommitsBranch, {
      response: { json: { created_at: "2000-01-01T00:00:00" } },
    });
    for (let i = 0; i < total; i++) {
      const tree = [];
      for (let j = 0; j < maxPerPage; j++) {
        const path = `file${i * maxPerPage + j + 1}.gpg`;
        tree.push({ path, type: "blob" });
        expectedResult.push(path);
      }
      expectNextFetch(pathTreeRecursive, {
        response: {
          headers: { link: { page: i + 1, total } },
          json: tree,
        },
      });
    }
    expect(await provider.list()).toEqual(expectedResult);
  });

  test("should use cached list if nothing committed since last fetch", async () => {
    let created_at = "2000-01-01T00:00:00";
    expectNextFetch(pathCommitsBranch, { response: { json: { created_at } } });
    expectNextFetch(pathTreeRecursive, {
      response: {
        headers: { link: { page: 1, total: 1 } },
        json: [
          { path: "file.txt", type: "blob" },
          { path: "ignored", type: "not-blob" }, // and skip nodes that are not blobs
          { path: "password.gpg", type: "blob" },
          { path: "site/username.gpg", type: "blob" },
        ],
      },
    });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);

    // Same latest commit date, so no further requests are made.
    // No fetch queued up, so it would error otherwise.
    expectNextFetch(pathCommitsBranch, { response: { json: { created_at } } });
    expect(await provider.list()).toEqual(["file.txt", "password.gpg", "site/username.gpg"]);

    // Simulate commit one second later.
    expectNextFetch(pathCommitsBranch, {
      response: { json: { created_at: "2000-01-01T00:00:01" } },
    });
    expectNextFetch(pathTreeRecursive, {
      response: {
        headers: { link: { page: 1, total: 1 } },
        json: [
          { path: "password.gpg", type: "blob" },
          { path: "password2.gpg", type: "blob" },
        ],
      },
    });
    expect(await provider.list()).toEqual(["password.gpg", "password2.gpg"]);
  });
});

describe("has", () => {
  const path = "fake.txt";

  test("should return true if path exists", async () => {
    expectNextFetch(pathFiles(path), { request: { method: "HEAD" } });
    expect(await provider.has(path)).toBe(true);
  });

  test("should return false if path does not exist", async () => {
    expectNextFetch(pathFiles(path), { request: { method: "HEAD" }, response: { status: 404 } });
    expect(await provider.has(path)).toBe(false);
  });

  test("should only intercept 404 responses", async () => {
    expectNextFetch(pathFiles(path), { response: { status: 400 } });
    await expect(provider.has(path)).rejects.toThrow();
  });

  test("should not intercept other errors", async () => {
    global.fetch.mockImplementationOnce(() => {
      throw new Error("boom!");
    });
    await expect(provider.has(path)).rejects.toThrow();
  });
});

describe("get", () => {
  const path = "file.txt";
  const content = "fake content";

  test("should return path content", async () => {
    expectNextFetch(pathFiles(path), { response: { json: { content } } });
    expect(await provider.get(path)).toBe(content);
  });
});

describe("set", () => {
  const path = "file.txt";
  const content = "fake content";
  const commit_message = "fake set";

  test("should add a new file", async () => {
    expectNextFetch(pathFiles(path), { request: { method: "HEAD" }, response: { status: 404 } });
    expectNextFetch(pathFiles(path), {
      request: { method: "POST", body: { branch, content, commit_message } },
    });
    await provider.set(path, content, commit_message);
  });

  test("should update an existing file", async () => {
    expectNextFetch(pathFiles(path), { request: { method: "HEAD" } });
    expectNextFetch(pathFiles(path), {
      request: { method: "PUT", body: { branch, content, commit_message } },
    });
    await provider.set(path, content, commit_message);
  });
});

describe("remove", () => {
  const path = "file.txt";
  const commit_message = "fake remove";

  test("should delete the file", async () => {
    expectNextFetch(pathFiles(path), {
      request: { method: "DELETE", body: { branch, commit_message } },
    });
    await provider.remove(path, commit_message);
  });
});

describe("duplicate", () => {
  const from = "file1.txt";
  const to = "file2.txt";
  const content = "fake content";
  const commit_message = "fake duplicate";

  test("should copy file to a new path", async () => {
    expectNextFetch(pathFiles(from), { response: { json: { content } } });
    expectNextFetch(pathFiles(to), { request: { method: "HEAD" }, response: { status: 404 } });
    expectNextFetch(pathFiles(to), {
      request: { method: "POST", body: { branch, content, commit_message } },
    });
    await provider.duplicate(from, to, commit_message);
  });

  test("should overwrite an existing file", async () => {
    expectNextFetch(pathFiles(from), { response: { json: { content } } });
    expectNextFetch(pathFiles(to), { request: { method: "HEAD" } });
    expectNextFetch(pathFiles(to), {
      request: { method: "PUT", body: { branch, content, commit_message } },
    });
    await provider.duplicate(from, to, commit_message);
  });
});

describe("rename", () => {
  const from = "file1.txt";
  const to = "file2.txt";
  const commit_message = "fake rename";

  test("should move the file", async () => {
    expectNextFetch(pathCommits, {
      request: {
        method: "POST",
        body: {
          branch,
          commit_message,
          actions: [{ action: "move", file_path: to, previous_path: from }],
        },
      },
    });
    await provider.rename(from, to, commit_message);
  });
});
