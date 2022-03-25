<script context="module">
  export const path = "settings/stores/add";
</script>

<script>
  import { ValidationError } from "yup";
  import { redirect } from "@/lib/routing";
  import { formToObject, setValidity } from "@/lib/form";
  import sourceSchema from "@/schemas/source";
  import SourceForm from "@/components/SourceForm";
  import { path as editStore } from "@/routes/EditStore";
  import keys from "@/local/keys";
  import sources from "@/local/sources";

  function onSubmit(event) {
    const form = event.target;
    const { name, ...data } = formToObject(form);

    if ($sources[name] && !confirm(`Overwrite existing store: ${name}?`)) return;

    try {
      $sources[name] = sourceSchema.validateSync(data, { context: { keys: $keys } });
    } catch (error) {
      if (error instanceof ValidationError) {
        setValidity(form, error.path, error.message);
      } else {
        throw error;
      }
      return;
    }

    redirect(editStore, { query: { name } });
  }
</script>

<h1>Password Stores</h1>

<section id="editor">
  <h2>Add Store</h2>
  <form on:submit|preventDefault={onSubmit}>
    <SourceForm />
    <input type="submit" value="Add Store" />
  </form>
</section>
