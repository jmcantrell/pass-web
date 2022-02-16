<script>
	import { Link } from "svelte-routing";
	import { sources } from "@/lib/localStorage";
</script>

<h1>Password sources</h1>

<section>
	{#each Object.entries($sources) as [name, source] (name)}
		<h2><Link to="sources/edit/{name}">{name}</Link></h2>
	{/each}
	<h2>+ <Link to="sources/add">Add source</Link></h2>
</section>
