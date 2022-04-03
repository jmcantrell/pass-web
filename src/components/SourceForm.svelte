<script>
  import Link from "@/components/Link";
  import NameField from "@/components/NameField";
  import providers from "@/components/providers";
  import { path as addKey } from "@/routes/AddKey";
  import keys from "@/local/keys";

  export let name, key, provider;
</script>

<fieldset>
  <legend>How would you like to refer to this store?</legend>
  <NameField
    required
    label="Store Name"
    value={name}
    placeholder="required, must be unique"
    on:input
  />
</fieldset>

<fieldset>
  <legend>How will the passwords be encrypted/decrypted?</legend>
  <label>
    Cryptography Key
    <select required name="key" bind:value={key} on:input>
      <option />
      {#each Object.keys($keys) as name}
        <option value={name}>{name}</option>
      {/each}
    </select>
  </label>
  {#if Object.keys($keys).length == 0}
    <div>
      You'll need to <Link path={addKey}>add a key</Link> before this store can be added.
    </div>
  {/if}
</fieldset>

<fieldset>
  <legend>Where is the store located?</legend>
  <label>
    Password Store Provider
    <select required name="provider" bind:value={provider} on:input>
      <option />
      {#each Object.entries(providers) as [id, { title }] (id)}
        <option value={id}>{title}</option>
      {/each}
    </select>
  </label>
</fieldset>

{#if provider}
  <fieldset>
    <legend>How can the store be accessed at {providers[provider].title}?</legend>
    <svelte:component this={providers[provider].default} {...$$restProps} on:input />
  </fieldset>
{/if}
