<script context="module">
	export const path = "passwords/edit";
</script>

<script>
	import { onMount } from "svelte";
	import { copy } from "@/lib/clipboard";
	import { redirect } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import Loading from "@/components/Loading";
	import ErrorList from "@/components/ErrorList";
	import EnsurePassword from "@/components/EnsurePassword";
	import PasswordFields from "@/components/PasswordFields";
	import PasswordLastUpdated from "@/components/PasswordLastUpdated";
	import PassphraseProtected from "@/components/PassphraseProtected";
	import { path as listPasswords } from "@/routes/ListPasswords";
	import stores from "@/local/stores";
	import sources from "@/local/sources";

	export let query;

	let form, source, name, title;
	let changed = false;

	onMount(async () => {
		source = query.get("source");
		name = query.get("name");
		title = `Password: ${source}/${name}`;
	});

	async function onCopyButtonClick() {
		const { password } = formToObject(form);
		await copy(password);
	}

	async function onSubmit() {
		const data = formToObject(form);
		await $stores[source].set(name, data);
		changed = false;
	}

	async function onRemoveButtonClick() {
		if (confirm(`Remove password: ${source}/${name}?`)) {
			await $stores[source].remove(name);
			redirect(listPasswords, { query: { source } });
		}
	}
</script>

<EnsurePassword {source} {name}>
	<h1>{title}</h1>

	<PassphraseProtected key={$sources[source].key}>
		{#await $stores[source].get(name)}
			<Loading>Fetching and decrypting content...</Loading>
		{:then options}
			<form bind:this={form} on:submit|preventDefault={onSubmit}>
				<fieldset>
					<legend>Decrypted Content</legend>
					<button on:click={onCopyButtonClick}>Copy password to clipboard</button>
					<PasswordFields {...options} on:input={() => (changed = true)} />
				</fieldset>
				<input type="submit" value="Save Changes" disabled={!changed} />
			</form>
		{:catch error}
			<ErrorList items={[error]} />
		{/await}
	</PassphraseProtected>

	<button on:click={onRemoveButtonClick}>Remove Password</button>

	<section id="updated">
		<h2>Last Updated</h2>
		<PasswordLastUpdated {source} {name} />
	</section>
</EnsurePassword>
