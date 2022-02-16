<script>
	import { onMount, beforeUpdate } from "svelte";
	import { Link, navigate } from "svelte-routing";
	import { objectFromForm } from "@/lib/form";
	import { keys, sources } from "@/lib/localStorage";
	import GPGKey from "@/components/GPGKey";
	import NotFound from "@/routes/NotFound";

	export let name;

	let key, sourcesUsingKey;

	onMount(() => {
		key = $keys[name];
	});

	beforeUpdate(() => {
		sourcesUsingKey = Object.keys($sources).filter(
			(source) => $sources[source].options.key == name
		);
	});

	function save(event) {
		key.options = objectFromForm(event.target);
		key.updated = new Date();
		$keys[name] = key;
	}

	function remove() {
		if (confirm(`Remove key: ${name}?`)) {
			$keys[name] = undefined;
			delete $keys[name];
			navigate("/keys");
		}
	}
</script>

{#if key}
	<h1>Edit encryption key</h1>

	<form on:submit|preventDefault={save}>
		<label for="name">Name</label>
		<span id="name">{name}</span>
		<GPGKey {...key.options} />
		<input type="submit" value="Save" />
		<input type="button" value="Remove" on:click={remove} />
	</form>

	<section>
		<h2>Last updated</h2>
		<p>{new Date(key.updated)}</p>
	</section>

	<section>
		<h2>Sources using this key</h2>
		<ul>
			{#each sourcesUsingKey as source}
				<li><Link to="sources/edit/{source}">{source}</Link></li>
			{/each}
		</ul>
	</section>
{:else}
	<NotFound name="Key" />
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
