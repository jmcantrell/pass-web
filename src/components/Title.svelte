<script>
  export let value = null;
</script>

<svelte:head>
  <title>{process.env.PACKAGE_NAME}{value ? `: ${value}` : ""}</title>
</svelte:head>
