<script context="module">
  export const path = "passwords/rename";
</script>

<script>
  import { redirect } from "@/lib/router";
  import Link from "@/components/Link";
  import NameField from "@/components/NameField";
  import EnsurePassword from "@/components/EnsurePassword";
  import stores from "@/local/stores";
  import createPageStore from "@/session/pages";
  import { path as editPassword } from "@/routes/EditPassword";
  import { path as listPasswords } from "@/routes/ListPasswords";

  export let source, name;

  let changed = false;

  $: store = $stores[source];
  $: listSession = createPageStore({}, listPasswords, { query: { source } });

  async function onSubmit(event) {
    const form = event.target;
    const newName = form.elements.name.value;
    const overwriting = await store.has(newName);

    if (overwriting && !confirm(`Overwrite existing password: ${newName}?`)) return;

    await store.rename(name, newName);
    $listSession.changed = true;
    redirect(editPassword, { query: { source, name: newName } });
  }
</script>

<EnsurePassword {source} {name}>
  <h1>
    Password:
    <Link path={listPasswords} query={{ source }}>{source}</Link> /
    <Link path={editPassword} query={{ source, name }}>{name}</Link>
  </h1>

  <section id="editor">
    <h2>Rename Password</h2>
    <form on:submit|preventDefault={onSubmit}>
      <fieldset>
        <legend>Where should it be moved?</legend>
        <NameField
          required
          value={name}
          label="Password Name"
          placeholder="required"
          on:input={() => (changed = true)}
        />
      </fieldset>
      <input type="submit" value="Rename Password" disabled={!changed} />
    </form>
  </section>
</EnsurePassword>
