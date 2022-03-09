import { FetchError } from "@/lib/error";

const url = "https://api.github.com";
const version = "v3";

export default function ({ repo, branch, token = null }) {
	async function request(path, payload = {}) {
		if (!payload.headers) {
			payload.headers = {};
		}

		payload.headers.accept = `application/vnd.github.${version}+json`;

		if (token) {
			payload.headers.authorization = `token ${token}`;
		}

		if (payload.body) {
			payload.body = JSON.stringify(payload.body);
		}

		const response = await fetch(`${url}/${path}`, payload);

		if (!response.ok) {
			throw new FetchError(response);
		}

		return await response.json();
	}

	async function list() {
		const data = await request(`repos/${repo}/git/trees/${branch}?recursive=1`);
		return data.tree.filter((node) => node.type == "blob").map((node) => node.path);
	}

	async function requestPath(path, payload = {}) {
		return await request(`repos/${repo}/contents/${path}`, payload);
	}

	async function requestPathSHA(path) {
		try {
			return (await requestPath(path)).sha;
		} catch (e) {
			if (e.name == "FetchError" && e.response.status == 404) {
				return null;
			}
			throw e;
		}
	}

	async function has(path) {
		return !!(await requestPathSHA(path));
	}

	async function get(path) {
		return atob((await requestPath(path)).content.replaceAll("\n", ""));
	}

	async function set(path, content, message, update = false) {
		const body = {
			message,
			content: btoa(content)
		};
		if (update) {
			body.sha = await requestPathSHA(path);
		}
		await requestPath(path, { method: "PUT", body });
	}

	async function updated(path) {
		const commits = await request(`repos/${repo}/commits?path=${path}&per_page=1&page=1`);
		return new Date(commits[0].commit.committer.date);
	}

	return {
		list,
		has,
		get,
		set,
		updated
	};
}
