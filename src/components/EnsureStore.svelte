<script>
  import NotFound from "@/components/NotFound";
  import stores from "@/local/stores";

  export let name;
</script>

{#if name in $stores}
  <slot />
{:else}
  <NotFound name="Store" value={name} />
{/if}
