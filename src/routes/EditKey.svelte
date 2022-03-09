<script context="module">
	export const path = "keys/edit";

	export function title({ query }) {
		return `Edit Key: ${query.get("name")}`;
	}
</script>

<script>
	import { onMount } from "svelte";
	import { redirect } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import Link from "@/components/Link";
	import KeyForm from "@/components/KeyForm";
	import EnsureKey from "@/components/EnsureKey";
	import * as listKeys from "@/routes/ListKeys";
	import * as editSource from "@/routes/EditSource";
	import keys from "@/local/keys";
	import sources from "@/local/sources";

	export let query;

	let key;

	onMount(() => {
		key = query.get("name");
	});

	$: sourcesUsingKey = Object.keys($sources).filter((source) => $sources[source].key == key);

	function onSubmit(event) {
		$keys[key].options = formToObject(event.target);
		$keys[key].updated = new Date();
	}

	function onRemoveButtonClick() {
		if (sourcesUsingKey.length > 0) {
			alert("Key is in use and cannot be removed!");
		} else if (confirm(`Remove key: ${key}?`)) {
			delete $keys[key];
			$keys = $keys;
			redirect(listKeys);
		}
	}
</script>

<EnsureKey name={key}>
	<form on:submit|preventDefault={onSubmit}>
		<fieldset>
			<legend>Key Options</legend>
			<KeyForm {...$keys[key].options} />
		</fieldset>
		<input type="submit" value="Save" />
		<input type="button" value="Remove" on:click={onRemoveButtonClick} />
	</form>

	<section id="updated">
		<h2>Last Updated</h2>
		{new Date($keys[key].updated)}
	</section>

	{#if sourcesUsingKey.length > 0}
		<section id="dependencies">
			<h2>Sources Using this Key</h2>
			<ul>
				{#each sourcesUsingKey as name}
					<li><Link to={editSource} query={{ name }}>{name}</Link></li>
				{/each}
			</ul>
		</section>
	{/if}
</EnsureKey>
