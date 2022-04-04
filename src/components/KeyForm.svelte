<script>
  import NameField from "@/components/NameField";
  import UploadableText from "@/components/UploadableText";

  export let name, publicKey, privateKey;
</script>

<fieldset>
  <legend>How would you like to refer to this key?</legend>
  <NameField
    required
    label="Key Name"
    value={name}
    placeholder="required, must be unique"
    on:input
  />
</fieldset>

<fieldset>
  <legend>How will passwords be encrypted?</legend>
  <UploadableText
    required
    name="publicKey"
    label="Armored Public Key"
    bind:value={publicKey}
    placeholder="required"
    on:input
  />
</fieldset>

<fieldset>
  <legend>How will passwords be decrypted?</legend>
  <UploadableText
    required
    name="privateKey"
    label="Armored Private Key"
    bind:value={privateKey}
    placeholder="required"
    on:input
  />
</fieldset>
