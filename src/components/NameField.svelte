<script>
  export let name = "name";
  export let label = "Name";
  export let value = "";
  export let placeholder = "";
  export let required = false;
</script>

<label>
  {label}
  <input {required} {name} bind:value maxlength="256" {placeholder} on:input />
</label>
