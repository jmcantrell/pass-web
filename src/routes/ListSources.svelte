<script context="module">
	export const path = "sources";
	export const title = "Password Stores";
</script>

<script>
	import Link from "@/components/Link";
	import * as addSource from "@/routes/AddSource";
	import * as listPasswords from "@/routes/ListPasswords";
	import sources from "@/local/sources";

	$: sourceNames = Object.keys($sources);
</script>

{#if sourceNames.length > 0}
	<h2>View Passwords</h2>
	<ul>
		{#each sourceNames as source}
			<li><Link to={listPasswords} query={{ source }}>{source}</Link></li>
		{/each}
	</ul>
{/if}

<h2>Actions</h2>
<ul>
	<li><Link to={addSource}>Add a new store</Link></li>
</ul>
