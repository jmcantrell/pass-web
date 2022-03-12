<script context="module">
	export const path = "passwords";
</script>

<script>
	import { onMount } from "svelte";
	import Link from "@/components/Link";
  import Loading from "@/components/Loading";
	import ErrorList from "@/components/ErrorList";
	import EnsureStore from "@/components/EnsureStore";
	import { path as editStore } from "@/routes/EditStore";
	import { path as addPassword } from "@/routes/AddPassword";
	import { path as editPassword } from "@/routes/EditPassword";
	import stores from "@/local/stores";

	export let query;

	let source, title, fetchNames;

	onMount(() => {
		source = query.get("source");
		title = `Password Store: ${source}`;
		load();
	});

	function load() {
		fetchNames = $stores[source].list();
	}
</script>

<EnsureStore name={source}>
	<h1>{title}</h1>

	<nav id="actions">
		<button on:click={load}>Refresh List</button>
		<Link path={addPassword} query={{ source }}>Add Password</Link>
		<Link path={editStore} query={{ name: source }}>Configure Store</Link>
	</nav>

	{#await fetchNames}
    <Loading name="passwords" />
	{:then names}
		<ul id="list">
			{#each names as name}
				<li><Link path={editPassword} query={{ source, name }}>{name}</Link></li>
			{/each}
		</ul>
	{:catch error}
		<ErrorList items={[error]} />
	{/await}
</EnsureStore>
