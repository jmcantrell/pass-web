<script context="module">
	export const path = "passwords/generate";

	export function title({ query }) {
		return `Generate Password: ${query.get("source")}`;
	}
</script>

<script>
	import { onMount } from "svelte";
	import { formToObject } from "@/lib/form";
	import { navigate } from "@/lib/routing";
	import EnsureSource from "@/components/EnsureSource";
	import GeneratePassword from "@/components/GeneratePassword";
	import * as viewPassword from "@/routes/ViewPassword";
	import stores from "@/local/stores";
	import sources from "@/local/sources";

	export let query;

	let source, key;

	onMount(() => {
		source = query.get("source");
		key = $sources[source].key;
	});

	async function onSubmit(event) {
		const { name, length, classes } = formToObject(event.target);
		await $stores[source].generate(name, parseInt(length), classes);
		navigate(viewPassword, { query: { source, name } });
	}
</script>

<EnsureSource name={source}>
	<form on:submit|preventDefault={onSubmit}>
		<label>
			Name
			<input name="name" maxlength="256" required />
		</label>
		<GeneratePassword />
		<input type="submit" value="Generate" />
	</form>
</EnsureSource>
