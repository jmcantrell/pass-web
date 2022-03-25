<script context="module">
  export const path = "settings/keys/add";
</script>

<script>
  import { ValidationError } from "yup";
  import { redirect } from "@/lib/routing";
  import { formToObject, setValidity } from "@/lib/form";
  import keySchema from "@/schemas/key";
  import KeyForm from "@/components/KeyForm";
  import { path as editKey } from "@/routes/EditKey";
  import keys from "@/local/keys";

  function onSubmit(event) {
    const form = event.target;
    const { name, ...data } = formToObject(form);

    if ($keys[name] && !confirm(`Overwrite existing key: ${name}?`)) return;

    try {
      $keys[name] = keySchema.validateSync(data);
    } catch (error) {
      if (error instanceof ValidationError) {
        setValidity(form, error.path, error.message);
      } else {
        throw error;
      }
      return;
    }

    redirect(editKey, { query: { name } });
  }
</script>

<h1>Cryptography Keys</h1>

<section id="editor">
  <h2>Add Key</h2>
  <form on:submit|preventDefault={onSubmit}>
    <KeyForm />
    <input type="submit" value="Add Key" />
  </form>
</section>
