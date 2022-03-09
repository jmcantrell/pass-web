<script>
	export let name = "Resource";
	export let value = null;
</script>

<h1>{name} Not Found</h1>
{#if value}
	<h2>{value}</h2>
{/if}
