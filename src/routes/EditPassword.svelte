<script context="module">
	export const path = "passwords/edit";

	export function title({ query }) {
		return `Edit Password: ${query.get("source")}/${query.get("name")}`;
	}
</script>

<script>
	import { onMount } from "svelte";
	import { navigate } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import ErrorList from "@/components/ErrorList";
	import EnsurePassword from "@/components/EnsurePassword";
	import PasswordLastUpdated from "@/components/PasswordLastUpdated";
	import PassphraseProtected from "@/components/PassphraseProtected";
	import * as viewPassword from "@/routes/ViewPassword";
	import stores from "@/local/stores";
	import sources from "@/local/sources";

	export let query;

	let source, name, key;

	onMount(async () => {
		source = query.get("source");
		name = query.get("name");
		key = $sources[source].key;
	});

	async function onSubmit(event) {
		const { text } = formToObject(event.target);
		await $stores[source].edit(name, text);
		navigate(viewPassword, { query: { source, name } });
	}
</script>

<EnsurePassword {source} {name}>
	<PassphraseProtected {key}>
		{#await $stores[source].get(name)}
			<p>Fetching and decrypting content...</p>
		{:then text}
			<form on:submit|preventDefault={onSubmit}>
				<label>
					Decrypted content
					<textarea name="text" value={text} rows="5" />
				</label>
				<input type="submit" value="Save" />
			</form>
		{:catch error}
			<ErrorList items={[error]} />
		{/await}
	</PassphraseProtected>

	<h2>Last Updated</h2>
	<PasswordLastUpdated {source} {name} />
</EnsurePassword>
