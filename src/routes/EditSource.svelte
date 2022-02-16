<script>
	import { onMount } from "svelte";
	import { navigate } from "svelte-routing";
	import { availableSources } from "@/lib/source";
	import { objectFromForm } from "@/lib/form";
	import { sources } from "@/lib/localStorage";
	import NotFound from "@/routes/NotFound";

	export let name;

	let source;

	onMount(() => {
		source = $sources[name];
	});

	function save(event) {
		source.options = objectFromForm(event.target);
		source.updated = new Date();
		$sources[name] = source;
	}

	function remove() {
		if (confirm(`Remove source: ${name}?`)) {
			$sources[name] = undefined;
			delete $sources[name];
			navigate("/sources");
		}
	}
</script>

{#if source}
	<h1>Edit password source</h1>

	<form on:submit|preventDefault={save}>
		<label for="name">Name</label>
		<span id="name">{name}</span>
		<svelte:component this={availableSources[source.type].component} {...source.options} />
		<input type="submit" value="Save" />
		<input type="button" value="Remove" on:click={remove} />
	</form>

	<section>
		<h2>Last updated</h2>
		<p>{new Date(source.updated)}</p>
	</section>
{:else}
	<NotFound name="Source" />
{/if}

<style>
	form {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 1em;
	}

	form input[type="submit"],
	form input[type="button"] {
		grid-column: 1 / span 2;
	}
</style>
