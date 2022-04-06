import { FetchError } from "@/lib/error";

export const version = "v4";
export const baseURL = `https://gitlab.com/api/${version}`;
export const maxPerPage = 100;

function parseLinkHeader(text) {
  return Object.fromEntries(
    text.split(", ").map((item) => {
      const split = item.split("; ");
      return [split[1].slice(5, -1), split[0].slice(1, -1)];
    })
  );
}

export default function ({ repo, branch, token }) {
  let cachedPaths = null;
  let cachedPathsTimestamp = null;

  async function request(url, payload = {}) {
    if (!payload.headers) payload.headers = {};

    payload.headers.authorization = `Bearer ${token}`;

    if (payload.body) {
      payload.headers["content-type"] = "application/json";
      payload.body = JSON.stringify(payload.body);
    }

    const response = await fetch(url, payload);
    if (!response.ok) throw new FetchError(response);

    return response;
  }

  async function exhaustPagination(path) {
    const pages = [];

    while (path) {
      const response = await request(path);
      pages.push(await response.json());
      path = parseLinkHeader(response.headers.get("link")).next;
    }

    return Array.prototype.concat(...pages);
  }

  function getProjectURL(path) {
    return `${baseURL}/projects/${encodeURIComponent(repo)}/repository/${path}`;
  }

  async function lastCommittedAt() {
    const response = await request(getProjectURL(`commits/${branch}`));
    const data = await response.json();
    return new Date(data.created_at);
  }

  async function list() {
    const committedAt = await lastCommittedAt();
    if (!cachedPaths || cachedPathsTimestamp < committedAt) {
      cachedPaths = (
        await exhaustPagination(
          getProjectURL(`tree?recursive=1&pagination=keyset&per_page=${maxPerPage}`)
        )
      )
        .filter((node) => node.type == "blob")
        .map((node) => node.path);
      cachedPathsTimestamp = committedAt;
    }
    return cachedPaths;
  }

  async function requestPath(path, payload = {}) {
    return await request(getProjectURL(`files/${encodeURIComponent(path)}?ref=${branch}`), payload);
  }

  async function has(path) {
    try {
      await requestPath(path, { method: "HEAD" });
      return true;
    } catch (error) {
      if (error instanceof FetchError && error.response.status == 404) {
        return false;
      } else {
        throw error;
      }
    }
  }

  async function get(path) {
    return atob((await (await requestPath(path)).json()).content);
  }

  async function set(path, content, commit_message) {
    await requestPath(path, {
      method: (await has(path)) ? "PUT" : "POST",
      body: {
        branch,
        content,
        commit_message,
      },
    });
  }

  async function remove(path, commit_message) {
    await requestPath(path, {
      method: "DELETE",
      body: {
        branch,
        commit_message,
      },
    });
  }

  async function duplicate(from, to, message) {
    await set(to, await get(from), message);
  }

  async function rename(previous_path, file_path, commit_message) {
    await request(getProjectURL(`commits`), {
      method: "POST",
      body: {
        branch,
        commit_message,
        actions: [{ action: "move", file_path, previous_path }],
      },
    });
  }

  return {
    list,
    has,
    get,
    set,
    remove,
    duplicate,
    rename,
  };
}
