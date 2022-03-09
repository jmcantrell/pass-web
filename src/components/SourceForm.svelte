<script>
	import * as sourceTypes from "@/lib/sources";
	import keys from "@/local/keys";

	export let key;
	export let type = null;
	export let options = {};
</script>

<label>
	Key
	<select name="key" bind:value={key} required>
		<option />
		{#each Object.keys($keys) as name}
			<option value={name}>{name}</option>
		{/each}
	</select>
</label>

{#if type}
	<svelte:component this={sourceTypes[type].form} {...options} />
{/if}
