<script>
	import * as details from "@/lib/hosts";

	export let id = "";
</script>

<label>
	Password Store Host
	<select name="type" bind:value={id} required>
		{#each Object.entries(details) as [value, { name }] (value)}
			<option {value}>{name}</option>
		{/each}
	</select>
</label>
