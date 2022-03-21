<script>
  import { setValidity, clearValidity } from "@/lib/form";
  import Password from "@/components/Password";
  import cryptors from "@/local/cryptors";

  export let key;
  export let label = "Content";

  $: cryptor = $cryptors[key];
  $: unlocked = cryptor.isUnlocked();

  async function onSubmit(event) {
    const form = event.target;
    const field = "passphrase";

    try {
      unlocked = await cryptor.unlock(form.elements[field].value);
    } catch (error) {
      setValidity(form, field, error.message);
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
      <Password label="Passphrase for {key}" name="passphrase" on:input={clearValidity} />
    </fieldset>
    <input type="submit" value="Verify Passphrase" />
  </form>
{/if}
