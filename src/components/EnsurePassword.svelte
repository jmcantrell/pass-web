<script>
	import NotFound from "@/components/NotFound";
	import ErrorList from "@/components/ErrorList";
	import EnsureSource from "@/components/EnsureSource";
	import stores from "@/local/stores";

	export let source, name;
</script>

<EnsureSource name={source}>
	{#await $stores[source].has(name)}
		<p>Loading password...</p>
	{:then exists}
		{#if exists}
			<slot />
		{:else}
			<NotFound name="Password" value={name} />
		{/if}
	{:catch error}
		<ErrorList items={[error]} />
	{/await}
</EnsureSource>
