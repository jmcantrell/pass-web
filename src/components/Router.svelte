<script>
  import page from "page";
  import { onMount } from "svelte";
  import { getHref } from "@/lib/routing";
  import routes from "@/routes";

  export let component, params;

  for (const module of Object.values(routes)) {
    page(getHref(module.path), (context) => {
      component = module.default;
      params = context.params || {};
      const query = new URLSearchParams(context.querystring || "");
      for (const [name, value] of query) {
        params[name] = value;
      }
    });
  }

  onMount(() => {
    page.start();
    return () => {
      page.stop();
    };
  });
</script>
