<script context="module">
	export const path = "keys/edit";
</script>

<script>
	import { onMount } from "svelte";
	import { redirect } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import Link from "@/components/Link";
	import EnsureKey from "@/components/EnsureKey";
	import KeyFieldsets from "@/components/KeyFieldsets";
	import { path as listKeys } from "@/routes/ListKeys";
	import { path as editStore } from "@/routes/EditStore";
	import keys from "@/local/keys";
	import sources from "@/local/sources";

	export let query;

	let key, title, storesUsingKey;
	let changed = false;

	onMount(() => {
		key = query.get("name");
		title = `Cryptography Key: ${key}`;
		storesUsingKey = Object.keys($sources).filter((source) => $sources[source].key == key);
	});

	function onSubmit(event) {
		const form = event.target;
		$keys[key].options = formToObject(form);
		$keys[key].updated = new Date();
		changed = false;
	}

	function onRemoveButtonClick() {
		if (storesUsingKey.length > 0) {
			alert("Key is in use and cannot be removed!");
			return;
		}
		if (confirm(`Remove cryptography key: ${key}?`)) {
			delete $keys[key];
			$keys = $keys;
			redirect(listKeys);
		}
	}
</script>

<EnsureKey name={key}>
	<h1>{title}</h1>

	<form on:submit|preventDefault={onSubmit}>
		<KeyFieldsets {...$keys[key].options} on:input={() => (changed = true)} />
		<input type="submit" value="Save Changes" disabled={!changed} />
	</form>

	<button on:click={onRemoveButtonClick}>Remove Key</button>

	<section id="updated">
		<h2>Last Updated</h2>
		{new Date($keys[key].updated)}
	</section>

	{#if storesUsingKey.length > 0}
		<section id="dependencies">
			<h2>Stores Using Key</h2>
			<ul>
				{#each storesUsingKey as name}
					<li><Link path={editStore} query={{ name }}>{name}</Link></li>
				{/each}
			</ul>
		</section>
	{/if}
</EnsureKey>
