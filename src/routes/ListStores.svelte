<script context="module">
	export const path = "stores";
</script>

<script>
	import Link from "@/components/Link";
	import { path as addStore } from "@/routes/AddStore";
	import { path as listPasswords } from "@/routes/ListPasswords";
	import sources from "@/local/sources";

	const title = "Password Stores";
</script>

<h1>{title}</h1>

<nav id="actions">
	<Link path={addStore}>Add Store</Link>
</nav>

<ul id="list">
	{#each Object.keys($sources) as source}
		<li><Link path={listPasswords} query={{ source }}>{source}</Link></li>
	{/each}
</ul>
