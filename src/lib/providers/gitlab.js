import { FetchError } from "@/lib/error";

const version = "v4";
const base_url = `https://gitlab.com/api/${version}`;

export default function ({ repo, branch, token = null }) {
  async function request(path, payload = {}) {
    if (!payload.headers) payload.headers = {};

    if (token) payload.headers.authorization = `Bearer ${token}`;

    if (payload.body) {
      payload.headers["content-type"] = "application/json";
      payload.body = JSON.stringify(payload.body);
    }

    const response = await fetch(
      `${base_url}/projects/${encodeURIComponent(repo)}/repository/${path}`,
      payload
    );
    if (!response.ok) throw new FetchError(response);

    return response;
  }

  function parseLinkHeader(text) {
    return Object.fromEntries(
      text.split(", ").map((item) => {
        const split = item.split("; ");
        const url = new URL(split[0].slice(1, -1));
        return [split[1].slice(5, -1), "tree" + url.search];
      })
    );
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

  async function list() {
    return (await exhaustPagination(`tree?recursive=1&pagination=keyset&per_page=100`))
      .filter((node) => node.type == "blob")
      .map((node) => node.path);
  }

  async function requestPath(path, payload = {}) {
    return await request(`files/${encodeURIComponent(path)}?ref=${branch}`, payload);
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
        commit_message,
        content
      }
    });
  }

  async function remove(path, commit_message) {
    await requestPath(path, {
      method: "DELETE",
      body: {
        branch,
        commit_message
      }
    });
  }

  async function duplicate(from, to, message) {
    await set(to, await get(from), message);
  }

  async function rename(previous_path, file_path, commit_message) {
    await request(`commits`, {
      method: "POST",
      body: {
        branch,
        commit_message,
        actions: [{ action: "move", file_path, previous_path }]
      }
    });
  }

  return { list, has, get, set, remove, duplicate, rename };
}
