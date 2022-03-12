<script>
	import Loading from "@/components/Loading";
	import ErrorList from "@/components/ErrorList";
	import stores from "@/local/stores";

	export let source, name;
</script>

{#await $stores[source].updated(name)}
	<Loading name="password details" />
{:then date}
	{date}
{:catch error}
	<ErrorList items={[error]} />
{/await}
