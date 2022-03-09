<script>
	import page from "page";
	import { onMount } from "svelte";
	import { getPath, getTitle } from "@/lib/routing";
	import routes from "@/routes";

	export let component, params, query, title;

	function setRoute(module, context = {}) {
		component = module.default;
		params = context.params || {};
		query = new URLSearchParams(context.querystring || "");
		title = getTitle(module, { params, query });
	}

	for (const module of Object.values(routes)) {
		page(getPath(module), (context) => {
			setRoute(module, context);
		});
	}

	onMount(() => {
		page.start();
		return () => {
			page.stop();
		};
	});
</script>
