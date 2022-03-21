<script>
  import Error from "@/components/Error";
  import Loading from "@/components/Loading";
  import NotFound from "@/components/NotFound";
  import EnsureStore from "@/components/EnsureStore";
  import stores from "@/local/stores";

  export let source, name;

  $: store = $stores[source];
</script>

<EnsureStore name={source}>
  {#await store.has(name)}
    <Loading name="password" />
  {:then exists}
    {#if exists}
      <slot />
    {:else}
      <NotFound name="Password" value={`${source}/${name}`} />
    {/if}
  {:catch error}
    <Error>{error}</Error>
  {/await}
</EnsureStore>
