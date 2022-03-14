<script context="module">
	export const path = "stores";
</script>

<script>
	import Link from "@/components/Link";
	import { path as listPasswords } from "@/routes/ListPasswords";
	import sources from "@/local/sources";

	const title = "Password Stores";
</script>

<h1>{title}</h1>

<ul id="list">
	{#each Object.keys($sources) as source}
		<li><Link path={listPasswords} query={{ source }}>{source}</Link></li>
	{/each}
</ul>
