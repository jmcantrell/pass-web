<script context="module">
  export const path = "passwords/edit";
</script>

<script>
  import { ValidationError } from "yup";
  import { redirect } from "@/lib/router";
  import { convertFormToObject } from "@/lib/form";
  import entrySchema from "@/schemas/entry";
  import Link from "@/components/Link";
  import Error from "@/components/Error";
  import Loading from "@/components/Loading";
  import PasswordForm from "@/components/PasswordForm";
  import EnsurePassword from "@/components/EnsurePassword";
  import PassphraseProtected from "@/components/PassphraseProtected";
  import stores from "@/local/stores";
  import sources from "@/local/sources";
  import createPageStore from "@/session/pages";
  import { path as editPassword } from "@/routes/EditPassword";
  import { path as listPasswords } from "@/routes/ListPasswords";
  import { path as renamePassword } from "@/routes/RenamePassword";
  import { path as duplicatePassword } from "@/routes/DuplicatePassword";

  export let source, name;

  $: store = $stores[source];
  $: key = $sources[source].key;
  $: listSession = createPageStore({}, listPasswords, { query: { source } });

  let changed = false;

  async function onSubmit(event) {
    const form = event.target;
    const { name: newName, ...data } = convertFormToObject(form);

    const renaming = name != newName;
    const overwriting = renaming && (await store.has(newName));

    if (overwriting && !confirm(`Overwrite existing password: ${newName}?`)) return;

    let entry;

    try {
      entry = entrySchema.validateSync(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        const input = form.elements[error.path];
        input.setCustomValidity(error.message);
        input.reportValidity();
      } else {
        throw error;
      }
      return;
    }

    await store.set(newName, entry);

    $listSession.changed = true;

    if (renaming) {
      await store.remove(name);
      redirect(editPassword, { query: { source, name: newName } });
      return;
    }

    changed = false;
  }

  async function onDeleteButtonClick() {
    if (!confirm(`Delete password: ${source}/${name}?`)) return;
    await store.remove(name);
    $listSession.changed = true;
    redirect(listPasswords, { query: { source } });
  }
</script>

<EnsurePassword {source} {name}>
  <h1>Password: <Link path={listPasswords} query={{ source }}>{source}</Link> / {name}</h1>

  <section id="actions">
    <h2>Actions</h2>
    <nav>
      <button on:click={onDeleteButtonClick}>Delete Password</button>
      <Link path={renamePassword} query={{ source, name }}>Rename Password</Link>
      <Link path={duplicatePassword} query={{ source, name }}>Duplicate Password</Link>
    </nav>
  </section>

  <section id="editor">
    <h2>Edit Password</h2>
    <PassphraseProtected {key}>
      {#await store.get(name)}
        <Loading>Fetching and decrypting content...</Loading>
      {:then entry}
        <form on:submit|preventDefault={onSubmit}>
          <PasswordForm {name} {...entry} on:submit={onSubmit} on:input={() => (changed = true)} />
          <input type="submit" value="Save Changes" disabled={!changed} />
        </form>
      {:catch error}
        <Error>{error}</Error>
      {/await}
    </PassphraseProtected>
  </section>
</EnsurePassword>
