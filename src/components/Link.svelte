<script>
  import { getHref } from "@/lib/routing";

  export let path;
  export let params = {};
  export let query = {};

  $: href = getHref(path, { params, query });
</script>

<a {href}><slot>{href}</slot></a>
