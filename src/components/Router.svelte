<script>
  import { onMount } from "svelte";
  import { start } from "@/lib/routing";
  import { convertSearchParamsToObject } from "@/lib/url";
  import NotFound from "@/components/NotFound";

  export let routes;

  let component, params;

  onMount(() => {
    return start(routes, NotFound, (route) => {
      const query = new URLSearchParams(location.search);
      component = route.component;
      params = { ...route.params, ...convertSearchParamsToObject(query) };
    });
  });
</script>

<svelte:component this={component} {...params} />
