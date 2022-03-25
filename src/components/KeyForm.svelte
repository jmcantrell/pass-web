<script>
  import NameField from "@/components/NameField";
  import UploadableText from "@/components/UploadableText";

  export let name, armoredPublicKey, armoredPrivateKey;
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
    name="armoredPublicKey"
    label="Armored Public Key"
    bind:value={armoredPublicKey}
    placeholder="required"
    on:input
  />
</fieldset>

<fieldset>
  <legend>How will passwords be decrypted?</legend>
  <UploadableText
    required
    name="armoredPrivateKey"
    label="Armored Private Key"
    bind:value={armoredPrivateKey}
    placeholder="required"
    on:input
  />
</fieldset>
