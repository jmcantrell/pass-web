<script>
	import page from "page";
	import { onMount } from "svelte";
	import { getHref } from "@/lib/routing";
	import routes from "@/routes";

	export let component, params, query;

	for (const module of Object.values(routes)) {
		page(getHref(module.path), (context) => {
			component = module.default;
			params = context.params || {};
			query = new URLSearchParams(context.querystring || "");
		});
	}

	onMount(() => {
		page.start();
		return () => {
			page.stop();
		};
	});
</script>
