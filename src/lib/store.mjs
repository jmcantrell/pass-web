const extension = ".gpg";
const newline = "\n";

function serializeContent(data) {
	const password = data.password || "";
	const extra = data.extra || "";
	return password + newline + extra;
}

function deserializeContent(text) {
	const lines = text.split(newline);
	const password = lines[0] || "";
	const extra = lines.slice(1).join(newline);
	return { password, extra };
}

export default function ({ api, cryptor }) {
	async function list() {
		return (await api.list())
			.filter((path) => path.endsWith(extension))
			.map((path) => path.slice(0, -extension.length));
	}

	async function has(name) {
		return await api.has(name + extension);
	}

	async function get(name) {
		const armoredMessage = await api.get(name + extension);
		const content = await cryptor.decrypt(armoredMessage);
		return deserializeContent(content);
	}

	async function set(name, data) {
		const update = await has(name);
		const content = serializeContent(data);
		const armoredMessage = await cryptor.encrypt(content);
		const commitMessage = `${update ? "Edit" : "Add"} password for ${name} using web interface.`;
		await api.set(name + extension, armoredMessage, commitMessage, update);
	}

	async function remove(name) {
		await api.remove(name + extension, `Remove password for ${name} using web interface.`);
	}

	async function updated(name) {
		return await api.updated(name + extension);
	}

	return {
		list,
		has,
		get,
		set,
		remove,
		updated
	};
}
