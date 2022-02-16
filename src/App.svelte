<script>
	import { Router, Link, Route } from "svelte-routing";
	import Keys from "@/routes/Keys";
	import AddKey from "@/routes/AddKey";
	import EditKey from "@/routes/EditKey";
	import Sources from "@/routes/Sources";
	import AddSource from "@/routes/AddSource";
	import EditSource from "@/routes/EditSource";

	export let url = "";
</script>

<Router {url}>
	<header>
		<nav>
			<Link to="">Home</Link>
			<Link to="keys">Keys</Link>
			<Link to="sources">Sources</Link>
		</nav>
	</header>
	<main>
		<Route path="keys/edit/:name" component={EditKey} />
		<Route path="keys/add" component={AddKey} />
		<Route path="keys" component={Keys} />
		<Route path="sources/edit/:name" component={EditSource} />
		<Route path="sources/add" component={AddSource} />
		<Route path="sources" component={Sources} />
	</main>
</Router>

<style>
	header nav {
		display: flex;
		justify-content: space-evenly;
	}
</style>
