<script context="module">
	import { redirect } from "@/lib/routing";
	import * as welcome from "@/routes/Welcome";
	import * as listSources from "@/routes/ListSources";

	export const path = "";
</script>

<script>
	import { onMount } from "svelte";
	import sources from "@/local/sources";

	onMount(() => {
		redirect(Object.keys($sources).length == 0 ? welcome : listSources);
	});
</script>
