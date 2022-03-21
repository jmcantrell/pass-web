<script context="module">
  export const path = "keys/edit";
</script>

<script>
  import { ValidationError } from "yup";
  import { redirect } from "@/lib/routing";
  import { formToObject, setValidity } from "@/lib/form";
  import keySchema from "@/schemas/key";
  import Link from "@/components/Link";
  import KeyForm from "@/components/KeyForm";
  import EnsureKey from "@/components/EnsureKey";
  import { path as settings } from "@/routes/Settings";
  import { path as editStore } from "@/routes/EditStore";
  import keys from "@/local/keys";
  import sources from "@/local/sources";

  export let name;

  let changed = false;

  $: sourcesUsingKey = Object.keys($sources).filter((source) => $sources[source].key == name);

  function onSubmit(event) {
    const form = event.target;
    const { name: newName, ...data } = formToObject(form);

    const renaming = name != newName;
    const overwriting = renaming && $keys[newName];

    if (overwriting && !confirm(`Overwrite existing key: ${newName}?`)) return;

    try {
      $keys[newName] = keySchema.validateSync(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        setValidity(form, error.path, error.message);
      } else {
        throw error;
      }
      return;
    }

    if (renaming) {
      for (const source of sourcesUsingKey) {
        $sources[source].key = newName;
      }
      delete $keys[name];
      $keys = $keys;
    }

    name = newName;
    changed = false;
  }

  function onRemoveButtonClick() {
    if (sourcesUsingKey.length > 0) {
      alert("Key is in use and cannot be removed!");
      return;
    }
    if (confirm(`Remove cryptography key: ${name}?`)) {
      delete $keys[name];
      $keys = $keys;
      redirect(settings);
    }
  }
</script>

<EnsureKey {name}>
  <h1>Edit Cryptography Key</h1>

  <form on:submit|preventDefault={onSubmit}>
    <KeyForm {name} {...$keys[name]} on:input={() => (changed = true)} />
    <input type="submit" value="Save Changes" disabled={!changed} />
  </form>

  <button on:click={onRemoveButtonClick}>Remove Key</button>

  {#if sourcesUsingKey.length > 0}
    <section id="dependencies">
      <h2>Stores Using this Key</h2>
      <ul>
        {#each sourcesUsingKey as name}
          <li><Link path={editStore} query={{ name }}>{name}</Link></li>
        {/each}
      </ul>
    </section>
  {/if}
</EnsureKey>
