<script context="module">
	export const path = "keys";
</script>

<script>
	import Link from "@/components/Link";
	import { path as addKey } from "@/routes/AddKey";
	import { path as editKey } from "@/routes/EditKey";
	import keys from "@/local/keys";

	const title = "Cryptography Keys";
</script>

<h1>{title}</h1>

<nav id="actions">
	<Link path={addKey}>Add Key</Link>
</nav>

<ul id="list">
  {#each Object.keys($keys) as name}
    <li><Link path={editKey} query={{ name }}>{name}</Link></li>
  {/each}
</ul>
