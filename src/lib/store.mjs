import { generate as generatePassword } from "@/lib/password";

const extension = ".gpg";

function normalizeText(text) {
	return text.trim() + "\n";
}

function joinLines(lines) {
	return normalizeText(lines.join("\n"));
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
		const content = await api.get(name + extension);
		const text = await cryptor.decrypt(content);
		return normalizeText(text);
	}

	async function set(name, text, message, update = false) {
		const armoredMessage = await cryptor.encrypt(normalizeText(text));
		await api.set(name + extension, armoredMessage, message, update);
	}

	async function add(name, text) {
		await set(name, text, `Add password for ${name} using web interface.`);
	}

	async function edit(name, text) {
		await set(name, text, `Edit password for ${name} using web interface.`, true);
	}

	async function updated(name) {
		return await api.updated(name + extension);
	}

	async function generate(name, length, options) {
		const lines = [generatePassword(length, options)];
		const message = `Generate password for ${name} using web interface.`;
		await set(name, joinLines(lines), message);
	}

	async function regenerate(name, length, options) {
		let lines = (await get(name)).split("\n");
		lines[0] = generatePassword(length, options);
		const message = `Regenerate password for ${name} using web interface.`;
		await set(name, joinLines(lines), message, true);
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
