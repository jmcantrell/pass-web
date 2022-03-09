<script context="module">
	export const path = "passwords/regenerate";

	export function title({ query }) {
		return `Regenerate Password: ${query.get("source")}/${query.get("name")}`;
	}
</script>

<script>
	import { onMount } from "svelte";
	import { navigate } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import EnsurePassword from "@/components/EnsurePassword";
	import GeneratePassword from "@/components/GeneratePassword";
	import PasswordLastUpdated from "@/components/PasswordLastUpdated";
	import PassphraseProtected from "@/components/PassphraseProtected";
	import * as ViewPassword from "@/routes/ViewPassword";
	import stores from "@/local/stores";
	import sources from "@/local/sources";

	export let query;

	let source, name, key;

	onMount(() => {
		source = query.get("source");
		name = query.get("name");
		key = $sources[source].key;
	});

	async function onSubmit(event) {
		if (confirm(`Regenerate password for ${source}:${name}?`)) {
			const { length, classes } = formToObject(event.target);
			await $stores[source].regenerate(name, parseInt(length), classes);
			navigate(ViewPassword, { query: { source, name } });
		}
	}
</script>

<EnsurePassword {source} {name}>
	<PassphraseProtected {key}>
		<form on:submit|preventDefault={onSubmit}>
			<GeneratePassword />
			<input type="submit" value="Regenerate" />
		</form>
	</PassphraseProtected>

	<h2>Last Updated</h2>
	<PasswordLastUpdated {source} {name} />
</EnsurePassword>
