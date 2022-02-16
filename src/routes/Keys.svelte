<script>
	import { Link } from "svelte-routing";
	import { keys } from "@/lib/localStorage";
</script>

<h1>Encryption keys</h1>

<section>
	{#each Object.entries($keys) as [name, key] (name)}
		<h2><Link to="keys/edit/{name}">{name}</Link></h2>
	{/each}
	<h2>+ <Link to="keys/add">Add key</Link></h2>
</section>
