<script context="module">
  export const path = "passwords/duplicate";
</script>

<script>
  import { redirect } from "@/lib/routing";
  import Link from "@/components/Link";
  import NameField from "@/components/NameField";
  import EnsurePassword from "@/components/EnsurePassword";
  import { path as editPassword } from "@/routes/EditPassword";
  import { path as listPasswords } from "@/routes/ListPasswords";
  import stores from "@/local/stores";
  import createPageStore from "@/session/pages";

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
    <h2>Duplicate Password</h2>
    <form on:submit|preventDefault={onSubmit}>
      <fieldset>
        <legend>Where should the duplicate be stored?</legend>
        <NameField
          required
          value={name}
          label="Password Name"
          placeholder="required"
          on:input={() => (changed = true)}
        />
      </fieldset>
      <input type="submit" value="Duplicate Password" disabled={!changed} />
    </form>
  </section>
</EnsurePassword>
