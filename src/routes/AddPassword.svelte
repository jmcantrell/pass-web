<script context="module">
  export const path = "passwords/add";
</script>

<script>
  import { ValidationError } from "yup";
  import { redirect } from "@/lib/routing";
  import { formToObject, setValidity } from "@/lib/form";
  import Link from "@/components/Link";
  import EnsureStore from "@/components/EnsureStore";
  import PasswordForm from "@/components/PasswordForm";
  import { path as editPassword } from "@/routes/EditPassword";
  import { path as listPasswords } from "@/routes/ListPasswords";
  import entrySchema from "@/schemas/entry";
  import stores from "@/local/stores";
  import createPageStore from "@/session/pages";

  export let source;

  $: store = $stores[source];
  $: listSession = createPageStore({}, listPasswords, { query: { source } });

  async function onSubmit(event) {
    const form = event.target;
    const { name, ...data } = formToObject(form);

    let entry;

    try {
      entry = entrySchema.validateSync(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        setValidity(form, error.path, error.message);
      } else {
        throw error;
      }
      return;
    }

    const overwriting = await store.has(name);

    if (overwriting && !confirm(`Overwrite existing password: ${name}?`)) return;

    await store.set(name, entry);
    $listSession.changed = true;
    redirect(editPassword, { query: { source, name } });
  }
</script>

<EnsureStore name={source}>
  <h1>
    Add Password:
    <Link path={listPasswords} query={{ source }}>{source}</Link>
  </h1>

  <form on:submit|preventDefault={onSubmit}>
    <PasswordForm />
    <input type="submit" value="Add Password" />
  </form>
</EnsureStore>
