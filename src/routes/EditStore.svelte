<script context="module">
	export const path = "stores/edit";
</script>

<script>
	import { onMount } from "svelte";
	import { redirect } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import EnsureStore from "@/components/EnsureStore";
	import HostFieldset from "@/components/HostFieldset";
	import { path as settings } from "@/routes/Settings";
	import sources from "@/local/sources";

	export let query;

	let name, title;
	let changed = false;

	onMount(() => {
		name = query.get("name");
		title = `Password Store: ${name}`;
	});

	function onSubmit(event) {
		const { key, ...options } = formToObject(event.target);
		$sources[name].key = key;
		$sources[name].options = options;
		$sources[name].updated = new Date();
		changed = false;
	}

	function onRemoveButtonClick() {
		if (confirm(`Remove password store: ${name}?`)) {
			delete $sources[name];
			$sources = $sources;
			redirect(settings);
		}
	}
</script>

<EnsureStore {name}>
	<h1>{title}</h1>

	<form on:submit|preventDefault={onSubmit}>
		<HostFieldset
			id={$sources[name].host}
			options={$sources[name].options}
			on:input={() => (changed = true)}
		/>
		<input type="submit" value="Save Changes" disabled={!changed} />
	</form>

	<button on:click={onRemoveButtonClick}>Remove Store</button>

	<section id="updated">
		<h2>Last Updated</h2>
		{new Date($sources[name].updated)}
	</section>
</EnsureStore>
