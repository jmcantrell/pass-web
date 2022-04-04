import { FetchError } from "@/lib/error";

const base_url = "https://api.github.com";
const version = "v3";

export default function ({ repo, branch, token = null }) {
  async function request(path, payload = {}) {
    if (!payload.headers) payload.headers = {};

    payload.headers.accept = `application/vnd.github.${version}+json`;

    if (token) payload.headers.authorization = `token ${token}`;

    if (payload.body) {
      payload.body = JSON.stringify(payload.body);
      payload.headers["content-type"] = "application/json";
    }

    const response = await fetch(`${base_url}/repos/${repo}/${path}`, payload);
    if (!response.ok) throw new FetchError(response);

    return await response.json();
  }

  async function requestPath(path, payload = {}) {
    return await request(`contents/${path}`, payload);
  }

  async function getPathSHA(path) {
    try {
      return (await requestPath(path)).sha;
    } catch (e) {
      if (e.name == "FetchError" && e.response.status == 404) {
        return null;
      } else {
        throw e;
      }
    }
  }

  async function getHeadSHA() {
    return (await request(`git/ref/heads/${branch}`)).object.sha;
  }

  async function setHeadSHA(sha) {
    await request(`git/refs/heads/${branch}`, { method: "PATCH", body: { sha } });
  }

  async function getTreeRecursive() {
    return (await request(`git/trees/${branch}?recursive=1`)).tree.filter(
      (node) => node.type == "blob"
    );
  }

  async function getSanitizedTree(callback = () => {}) {
    return (await getTreeRecursive()).map((node) => {
      callback(node);
      delete node.url;
      delete node.size;
      return node;
    });
  }

  async function createTree(tree) {
    return await request(`git/trees`, {
      method: "POST",
      body: { tree },
    });
  }

  async function createCommit(tree, message) {
    return await request(`git/commits`, {
      method: "POST",
      body: { message, tree, parents: [await getHeadSHA()] },
    });
  }

  async function addCommit(tree, message) {
    const { sha } = await createTree(tree);
    const commit = await createCommit(sha, message);
    await setHeadSHA(commit.sha);
  }

  async function list() {
    return (await getTreeRecursive()).map((node) => node.path);
  }

  async function has(path) {
    return !!(await getPathSHA(path));
  }

  async function get(path) {
    return atob((await requestPath(path)).content.replaceAll("\n", ""));
  }

  async function set(path, text, message) {
    await requestPath(path, {
      method: "PUT",
      body: {
        message,
        content: btoa(text),
        sha: await getPathSHA(path),
      },
    });
  }

  async function remove(path, message) {
    await requestPath(path, {
      method: "DELETE",
      body: {
        message,
        sha: await getPathSHA(path),
      },
    });
  }

  async function duplicate(from, to, message) {
    await set(to, await get(from), message);
  }

  async function rename(from, to, message) {
    const tree = await getSanitizedTree((node) => {
      if (node.path == from) node.path = to;
    });
    await addCommit(tree, message);
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
