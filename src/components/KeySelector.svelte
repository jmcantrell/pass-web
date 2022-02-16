<script>
	import { keys } from "@/lib/localStorage";
	export let key;
</script>

<label for="keys">Key</label>
<select id="keys" name="key" bind:value={key} required>
	<option />
	{#each Object.keys($keys) as name}
		<option value={name}>{name}</option>
	{/each}
</select>
