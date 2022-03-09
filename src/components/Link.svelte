<script>
	import { getPath, getTitle } from "@/lib/routing";

	export let to;
	export let params = {};
	export let query = {};

	$: options = { params, query };
</script>

<a href={getPath(to, options)}><slot>{getTitle(to, options)}</slot></a>
