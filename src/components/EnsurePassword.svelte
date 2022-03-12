<script>
	import Loading from "@/components/Loading";
	import NotFound from "@/components/NotFound";
	import ErrorList from "@/components/ErrorList";
	import EnsureStore from "@/components/EnsureStore";
	import stores from "@/local/stores";

	export let source, name;
</script>

<EnsureStore name={source}>
	{#await $stores[source].has(name)}
		<Loading name="password" />
	{:then exists}
		{#if exists}
			<slot />
		{:else}
			<NotFound name="Password" value={`${source}/${name}`} />
		{/if}
	{:catch error}
		<ErrorList items={[error]} />
	{/await}
</EnsureStore>
