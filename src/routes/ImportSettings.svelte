<script context="module">
  export const path = "settings/import";
</script>

<script>
  import { readMessage, decrypt as decryptWithPGP } from "openpgp";
  import { isPlainObject } from "@/lib/object";
  import { redirect } from "@/lib/routing";
  import Password from "@/components/Password";
  import keySchema from "@/schemas/key";
  import sourceSchema from "@/schemas/source";
  import optionsSchema from "@/schemas/options";
  import keys from "@/local/keys";
  import sources from "@/local/sources";
  import options from "@/local/options";
  import { path as settings } from "@/routes/Settings";

  async function decrypt(armoredMessage, passwords) {
    const message = await readMessage({ armoredMessage });
    const { data } = await decryptWithPGP({ message, passwords });
    return data;
  }

  async function onSubmit(event) {
    const form = event.target;
    const passphrase = form.elements["passphrase"].value;
    const text = await form.elements["file"].files[0].text();
    const content = passphrase ? await decrypt(text, passphrase) : text;
    const data = JSON.parse(content);

    let existingKeys = 0;
    let existingSources = 0;

    const newKeys = {};

    if (isPlainObject(data.keys)) {
      for (const [name, value] of Object.entries(data.keys)) {
        newKeys[name] = keySchema.validateSync(value);
        if ($keys[name]) existingKeys += 1;
      }
    }

    const allKeys = { ...$keys, ...newKeys };

    const newSources = {};

    if (isPlainObject(data.sources)) {
      for (const [name, value] of Object.entries(data.sources)) {
        newSources[name] = sourceSchema.validateSync(value, { context: { keys: allKeys } });
        if ($sources[name]) existingSources += 1;
      }
    }

    const newOptions = optionsSchema.validateSync(isPlainObject(data.options) ? data.options : {});

    if (existingKeys > 0 || existingSources > 0) {
      const existing = [];
      if (existingKeys > 0) {
        existing.push(`${existingKeys} ${existingKeys == 1 ? "key" : "keys"}`);
      }
      if (existingSources > 0) {
        existing.push(`${existingSources} ${existingSources == 1 ? "source" : "sources"}`);
      }
      if (!confirm(`Overwrite ${existing.join(" and ")}?`)) return;
    }

    $keys = newKeys;
    $sources = newSources;
    $options = newOptions;

    redirect(settings);
  }
</script>

<h1>Import Settings</h1>

<section id="editor">
  <form on:submit|preventDefault={onSubmit}>
    <fieldset>
      <legend>Where are the settings stored?</legend>
      <label>
        Settings File
        <input type="file" name="file" required />
      </label>
    </fieldset>
    <fieldset>
      <legend>Is the file encrypted?</legend>
      <Password label="Decryption Passphrase" name="passphrase" required={false} />
    </fieldset>
    <input type="submit" value="Import Settings File" />
  </form>
</section>
