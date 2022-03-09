<script>
	import NotFound from "@/components/NotFound";
	import keys from "@/local/keys";

	export let name;
</script>

{#if name}
	{#if name in $keys}
		<slot />
	{:else}
		<NotFound name="Key" value={name} />
	{/if}
{:else}
	<NotFound name="Key" />
{/if}
