<script>
  export let input = null;
  export let label = "Password";
  export let name = "password";
  export let value = "";
  export let placeholder = "";
  export let visible = false;
  export let required = true;
</script>

<label for="password">
  {label}
  <div class="row">
    <input
      bind:this={input}
      id="password"
      type={visible ? "text" : "password"}
      autocomplete="new-password"
      {name}
      {value}
      {placeholder}
      {required}
      on:input={(event) => event.target.setCustomValidity("")}
    />
    <button type="button" on:click={() => (visible = !visible)}>{visible ? "Hide" : "Show"}</button>
    <slot name="buttons" />
  </div>
  <slot />
</label>

<style>
  div {
    gap: var(--s-1);
  }
  input {
    flex-grow: 1;
  }
</style>
