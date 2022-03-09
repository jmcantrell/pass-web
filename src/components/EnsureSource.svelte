<script>
	import NotFound from "@/components/NotFound";
	import sources from "@/local/sources";

	export let name;
</script>

{#if name}
	{#if name in $sources}
		<slot />
	{:else}
		<NotFound name="Source" value={name} />
	{/if}
{:else}
	<NotFound name="Source" />
{/if}
