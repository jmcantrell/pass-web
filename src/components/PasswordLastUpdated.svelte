<script>
	import ErrorList from "@/components/ErrorList";
	import stores from "@/local/stores";

	export let source, name;
</script>

{#await $stores[source].updated(name)}
	Loading password details...
{:then date}
	{date}
{:catch error}
	<ErrorList items={[error]} />
{/await}
