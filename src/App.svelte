<script>
	import { onMount } from "svelte";
	import { name, version } from "@/lib/app";
	import { info } from "@/lib/logging";
	import Link from "@/components/Link";
	import Router from "@/components/Router";
	import LockStoresAfterVisibilityLoss from "@/components/LockStoresAfterVisibilityLoss";
	import { path as home } from "@/routes/Home";
	import { path as listStores } from "@/routes/ListStores";
	import { path as settings } from "@/routes/Settings";

	let component, params, query;

	onMount(() => {
		info(`v${version} mounted`);
	});
</script>

<svelte:head>
	<title>{name}</title>
</svelte:head>

<Router bind:component bind:params bind:query />

<LockStoresAfterVisibilityLoss />

<header>
	<nav id="menu">
		<Link path={home}>Home</Link>
		<Link path={listStores}>Password Stores</Link>
		<Link path={settings}>Settings</Link>
	</nav>
</header>

<main>
	<svelte:component this={component} {...params} {query} />
</main>
