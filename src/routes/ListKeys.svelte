<script context="module">
	export const path = "keys";
	export const title = "Cryptography Keys";
</script>

<script>
	import Link from "@/components/Link";
	import * as addKey from "@/routes/AddKey";
	import * as editKey from "@/routes/EditKey";
	import keys from "@/local/keys";

	$: keyNames = Object.keys($keys);
</script>

{#if keyNames.length > 0}
	<h2>Edit Key</h2>
	<ul>
		{#each keyNames as name}
			<li><Link to={editKey} query={{ name }}>{name}</Link></li>
		{/each}
	</ul>
{/if}

<h2>Actions</h2>
<ul>
	<li><Link to={addKey}>Add a new key</Link></li>
</ul>
