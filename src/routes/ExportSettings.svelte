<script context="module">
	export const path = "settings/export";
</script>

<script>
	import { createMessage, encrypt, enums } from "openpgp";
	import { name } from "@/lib/app";
	import * as settings from "@/lib/settings";
	import { formToObject } from "@/lib/form";
	import Password from "@/components/Password";
	import keys from "@/local/keys";
	import sources from "@/local/sources";

	let href, filename;

	function getLocalStorage(name) {
		return JSON.parse(localStorage.getItem(name));
	}

	async function encryptText(text, passphrase) {
		const message = await createMessage({ text });
		const config = { preferredCompressionAlgorithm: enums.compression.zlib };
		return await encrypt({ message, passwords: [passphrase], config });
	}

	function getData(selected = {}) {
		const data = {};

		for (const type of ["keys", "sources"]) {
			const values = selected[type];
			if (Array.isArray(values) && values.length > 0) {
				const local = getLocalStorage(type);
				data[type] = Object.fromEntries(values.map((name) => [name, local[name]]));
			}
		}

		const values = selected.settings;
		if (Array.isArray(values) && values.length > 0) {
			data.settings = Object.fromEntries(
				values.map((name) => [name, getLocalStorage(`settings.${name}`)])
			);
		}

		return data;
	}

	function reset() {
		href = filename = null;
	}

	async function onSubmit(event) {
		const form = event.target;
		const { passphrase, ...selected } = formToObject(form);
		console.debug(selected);
		const text = JSON.stringify(getData(selected));
		const extension = passphrase ? ".asc" : ".json";
		const type = passphrase ? "text/plain" : "application/json";
		const content = passphrase ? await encryptText(text, passphrase) : text;
		href = `data:${type};base64,${btoa(content)}`;
		filename = `${name}-export-${new Date().toISOString()}${extension}`;
	}
</script>

<h1>Export Settings</h1>

<form on:submit|preventDefault={onSubmit}>
	<fieldset>
		<legend>What should be exported?</legend>

		<fieldset>
			<legend>Cryptography Keys</legend>
			{#each Object.keys($keys) as name}
				<label class="row">
					<input type="checkbox" name="keys" value={name} checked multiple on:change={reset} />
					{name}
				</label>
			{/each}
		</fieldset>

		<fieldset>
			<legend>Password Stores</legend>
			{#each Object.keys($sources) as name}
				<label class="row">
					<input type="checkbox" name="sources" value={name} checked multiple on:change={reset} />
					{name}
				</label>
			{/each}
		</fieldset>

		<fieldset>
			<legend>Application</legend>
			{#each Object.entries(settings) as [name, { title }] (title)}
				<label class="row">
					<input type="checkbox" name="settings" value={name} checked multiple on:change={reset} />
					{title}
				</label>
			{/each}
		</fieldset>

		<Password label="Encryption Passphrase" name="passphrase" required={false} on:input={reset} />
	</fieldset>

	{#if href}
		<div class="link">
			<a {href} download={filename}>{filename}</a>
		</div>
	{/if}

	<input type="submit" value="Generate Download" disabled={!!href} />
</form>

<style>
	div.link {
		text-align: center;
	}
</style>
