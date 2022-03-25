<script context="module">
  export const path = "settings/export";
</script>

<script>
  import { createMessage, encrypt as encryptWithPGP } from "openpgp";
  import { name, version } from "@/lib/app";
  import Password from "@/components/Password";
  import keys from "@/local/keys";
  import sources from "@/local/sources";
  import options from "@/local/options";

  let href, filename;

  async function encrypt(text, passwords) {
    const message = await createMessage({ text });
    return await encryptWithPGP({ message, passwords });
  }

  function reset() {
    href = filename = null;
  }

  async function onSubmit(event) {
    const form = event.target;
    const passphrase = form.elements.passphrase.value;
    const text = JSON.stringify({
      version,
      keys: $keys,
      sources: $sources,
      options: $options
    });
    const extension = passphrase ? "asc" : "json";
    const type = passphrase ? "text/plain" : "application/json";
    const content = passphrase ? await encrypt(text, passphrase) : text;
    href = `data:${type};base64,${btoa(content)}`;
    filename = `${name}-export-${new Date().toISOString()}.${extension}`;
  }
</script>

<h1>Export Settings</h1>

<section id="editor">
  <form on:submit|preventDefault={onSubmit}>
    <fieldset>
      <legend>Should the export file be encrypted?</legend>
      <Password label="Encryption Passphrase" name="passphrase" required={false} on:input={reset} />
    </fieldset>
    <input type="submit" value="Generate Export File" disabled={!!href} />
  </form>
</section>

{#if href}
  <section id="download" class="center">
    <a {href} download={filename}>Download Export File</a>
  </section>
{/if}
