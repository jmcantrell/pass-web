<script>
  export let name = "name";
  export let label = "Name";
  export let value = "";
  export let placeholder = "";
  export let required = false;
  export let pattern = null;
</script>

<label>
  {label}
  <input {required} {name} bind:value maxlength="256" {placeholder} {pattern} on:input />
</label>
