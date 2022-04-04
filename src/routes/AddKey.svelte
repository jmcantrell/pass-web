<script context="module">
  export const path = "keys/add";
</script>

<script>
  import { ValidationError } from "yup";
  import { redirect } from "@/lib/router";
  import { convertFormToObject } from "@/lib/form";
  import keySchema from "@/schemas/key";
  import KeyForm from "@/components/KeyForm";
  import keys from "@/local/keys";
  import { path as editKey } from "@/routes/EditKey";

  function onSubmit(event) {
    const form = event.target;
    const { name, ...data } = convertFormToObject(form);

    if ($keys[name] && !confirm(`Overwrite existing key: ${name}?`)) return;

    try {
      $keys[name] = keySchema.validateSync(data);
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
