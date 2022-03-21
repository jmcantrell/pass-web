<script>
  export let name = "Resource";
  export let value = null;
</script>

<h1>
  {name} Not Found{#if value}: {value}{/if}
</h1>
