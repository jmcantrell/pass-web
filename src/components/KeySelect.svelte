<script>
	import Link from "@/components/Link";
	import { path as addKey } from "@/routes/AddKey";
	import keys from "@/local/keys";

	export let key;
</script>

<label>
	Cryptography Key
	<select name="key" bind:value={key} required>
		<option />
		{#each Object.keys($keys) as name}
			<option value={name}>{name}</option>
		{/each}
	</select>
</label>

{#if Object.keys($keys).length == 0}
	<div>
	  You'll need to <Link path={addKey}>add a key</Link> before this store can be added.
	</div>
{/if}
