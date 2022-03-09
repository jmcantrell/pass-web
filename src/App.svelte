<script>
	import Link from "@/components/Link";
	import Router from "@/components/Router";
	import LockStoresAfterVisibilityLoss from "@/components/LockStoresAfterVisibilityLoss";
	import * as listKeys from "@/routes/ListKeys";
	import * as listSources from "@/routes/ListSources";

	let component, params, query, title;
</script>

<Router bind:component bind:params bind:query bind:title />

<LockStoresAfterVisibilityLoss />

<svelte:head>
	<title>{title}</title>
</svelte:head>

<header>
	<nav>
		<Link to={listSources} />
		<Link to={listKeys} />
	</nav>
	<h1>{title}</h1>
</header>

<main>
	<svelte:component this={component} {...params} {query} />
</main>

<style>
	nav {
		display: flex;
		gap: var(--gap);
	}
</style>
