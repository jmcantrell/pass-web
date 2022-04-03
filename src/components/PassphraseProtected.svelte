<script>
  import Password from "@/components/Password";
  import cryptors from "@/local/cryptors";

  export let key;
  export let label = "Content";

  $: cryptor = $cryptors[key];
  $: unlocked = cryptor.isUnlocked();

  async function onSubmit(event) {
    const form = event.target;
    const input = form.elements.passphrase;

    try {
      unlocked = await cryptor.unlock(input.value);
    } catch (error) {
      input.setCustomValidity(error.message);
      input.reportValidity();
    }

    form.reset();
  }
</script>

{#if unlocked}
  <slot />
{:else}
  <form on:submit|preventDefault={onSubmit}>
    <fieldset>
      <legend>Unlock {label}</legend>
      <Password label="Passphrase for {key}" name="passphrase" />
    </fieldset>
    <input type="submit" value="Verify Passphrase" />
  </form>
{/if}
