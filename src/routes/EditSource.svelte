<script context="module">
	export const path = "sources/edit";

	export function title({ query }) {
		return `Edit Source: ${query.get("name")}`;
	}
</script>

<script>
	import { onMount } from "svelte";
	import { redirect } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import * as sourceTypes from "@/lib/sources";
	import SourceForm from "@/components/SourceForm";
	import EnsureSource from "@/components/EnsureSource";
	import * as listSources from "@/routes/ListSources";
	import sources from "@/local/sources";

	export let query;

	let name, type;

	onMount(() => {
		name = query.get("name");
		type = $sources[name].type;
	});

	function onSubmit(event) {
		const { key, ...options } = formToObject(event.target);
		$sources[name].key = key;
		$sources[name].options = options;
		$sources[name].updated = new Date();
	}

	function onRemoveButtonClick() {
		if (confirm(`Remove source: ${name}?`)) {
			delete $sources[name];
			$sources = $sources;
			redirect(listSources);
		}
	}
</script>

<EnsureSource {name}>
	<form on:submit|preventDefault={onSubmit}>
		<fieldset>
			<legend>{sourceTypes[type].name} Source Options</legend>
			<SourceForm {type} key={$sources[name].key} options={$sources[name].options} />
			<input type="submit" value="Save" />
			<input type="button" value="Remove" on:click={onRemoveButtonClick} />
		</fieldset>
	</form>

	<h2>Last Updated</h2>
	{new Date($sources[name].updated)}
</EnsureSource>
