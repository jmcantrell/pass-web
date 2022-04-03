<script>
  import { getURI } from "@/lib/routing";

  export let path;
  export let query = {};
  export let params = {};

  $: href = getURI(path, { query, params });
</script>

<a {href}><slot>{href}</slot></a>
