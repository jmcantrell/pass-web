<script context="module">
  export const path = "settings/import";
</script>

<script>
  import { readMessage, decrypt as decryptWithPGP } from "openpgp";
  import { isPlainObject } from "@/lib/util";
  import Password from "@/components/Password";
  import keySchema from "@/schemas/key";
  import sourceSchema from "@/schemas/source";
  import optionsSchema from "@/schemas/options";
  import keys from "@/local/keys";
  import sources from "@/local/sources";
  import options from "@/local/options";

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

    const newKeys = {};

    if (isPlainObject(data.keys)) {
      for (const [name, value] of Object.entries(data.keys)) {
        newKeys[name] = keySchema.validateSync(value);
      }
    }

    const allKeys = { ...$keys, ...newKeys };

    const newSources = {};

    if (isPlainObject(data.sources)) {
      for (const [name, value] of Object.entries(data.sources)) {
        newSources[name] = sourceSchema.validateSync(value, { context: { keys: allKeys } });
      }
    }

    const newOptions = optionsSchema.validateSync(isPlainObject(data.options) ? data.options : {});

    $keys = newKeys;
    $sources = newSources;
    $options = newOptions;
  }
</script>

<h1>Import Settings</h1>

<p>
  <strong>NOTE</strong>: Data from the file being imported will be merged with the existing
  application data. Any key or store names that already exist will be overwritten.
</p>

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
