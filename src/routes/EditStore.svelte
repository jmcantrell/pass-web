<script context="module">
  export const path = "stores/edit";
</script>

<script>
  import { ValidationError } from "yup";
  import { redirect } from "@/lib/router";
  import { convertFormToObject } from "@/lib/form";
  import sourceSchema from "@/schemas/source";
  import SourceForm from "@/components/SourceForm";
  import EnsureStore from "@/components/EnsureStore";
  import keys from "@/local/keys";
  import sources from "@/local/sources";
  import { path as settings } from "@/routes/Settings";

  export let name;

  let changed = false;

  function onSubmit(event) {
    const form = event.target;
    const { name: newName, ...data } = convertFormToObject(form);

    const renaming = name != newName;
    const overwriting = renaming && $sources[newName];

    if (overwriting && !confirm(`Overwrite existing store: ${newName}?`)) return;

    try {
      $sources[newName] = sourceSchema.validateSync(data, { context: { keys: $keys } });
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

    if (renaming) {
      delete $sources[name];
      $sources = $sources;
      redirect(path, { query: { name: newName } });
      return;
    }

    changed = false;
  }

  function onRemoveButtonClick() {
    if (confirm(`Remove password store: ${name}?`)) {
      delete $sources[name];
      $sources = $sources;
      redirect(settings);
    }
  }
</script>

<EnsureStore {name}>
  <h1>Password Store: {name}</h1>

  <section id="actions">
    <h2>Actions</h2>
    <nav>
      <button on:click={onRemoveButtonClick}>Remove Store</button>
    </nav>
  </section>

  <section id="editor">
    <h2>Edit Store</h2>
    <form on:submit|preventDefault={onSubmit}>
      <SourceForm {name} {...$sources[name]} on:input={() => (changed = true)} />
      <input type="submit" value="Save Changes" disabled={!changed} />
    </form>
  </section>
</EnsureStore>
