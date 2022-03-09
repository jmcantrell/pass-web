import { generate as generatePassword } from "@/lib/password";

const extension = ".gpg";
const newline = "\n";

function serializeContent(data) {
	const password = data.password || "";
	const extra = (data.extra || "").split(newline);
	const lines = [password, ...extra];
	const text = lines.join(newline);
	return text.trim() + newline;
}

function deserializeContent(text) {
	const lines = text.trim().split(newline);
	const password = lines[0];
	const extra = lines.slice(1);
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

	async function set(name, data, message, update = false) {
		const content = serializeContent(data);
		const armoredMessage = await cryptor.encrypt(content);
		await api.set(name + extension, armoredMessage, message, update);
	}

	async function add(name, data) {
		await set(name, data, `Add password for ${name} using web interface.`);
	}

	async function edit(name, data) {
		await set(name, data, `Edit password for ${name} using web interface.`, true);
	}

	async function updated(name) {
		return await api.updated(name + extension);
	}

	async function generate(name, length, options) {
		const data = { password: generatePassword(length, options) };
		const message = `Generate password for ${name} using web interface.`;
		await set(name, data, message);
	}

	async function regenerate(name, length, options) {
		const data = await get(name);
		data.password = generatePassword(length, options);
		const message = `Regenerate password for ${name} using web interface.`;
		await set(name, data, message, true);
	}

	return {
		list,
		has,
		get,
		add,
		edit,
		updated,
		generate,
		regenerate
	};
}
