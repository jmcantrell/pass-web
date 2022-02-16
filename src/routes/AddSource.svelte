<script>
	import { navigate } from "svelte-routing";
	import { objectFromForm } from "@/lib/form";
	import { availableSources } from "@/lib/source";
	import { sources } from "@/lib/localStorage";

	let type;

	function save(event) {
		const { name, ...options } = objectFromForm(event.target);

		if (!$sources[name] || confirm("Overwrite existing source?")) {
			$sources[name] = { type, options, updated: new Date() };
			navigate(`/sources/edit/${name}`, { replace: true });
		}
	}

	function cancel(event) {
		event.target.reset();
		type = null;
	}
</script>

<h1>Add password source</h1>

{#if type}
	<form on:submit|preventDefault={save} on:reset|preventDefault={cancel}>
		<label for="name">Name</label>
		<input
			id="name"
			name="name"
			placeholder="required, must be unique"
			autocomplete="off"
			required
		/>
		<svelte:component this={availableSources[type].component} />
		<input type="submit" value="Save" />
		<input type="reset" value="Cancel" />
	</form>
{:else}
	<h2>Select source type</h2>
	<section>
		{#each Object.entries(availableSources) as [id, source] (id)}
			<button on:click={() => (type = id)}>{source.name}</button>
		{/each}
	</section>
{/if}

<style>
	form {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 1em;
	}

	form input[type="submit"],
	form input[type="reset"] {
		grid-column: 1 / span 2;
	}

	section {
		display: flex;
		flex-direction: column;
	}
</style>
