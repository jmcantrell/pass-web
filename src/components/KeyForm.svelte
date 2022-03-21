<script>
  export let name, armoredPublicKey, armoredPrivateKey;
</script>

<fieldset>
  <legend>How would you like to refer to this key?</legend>
  <label>
    Key Name
    <input required name="name" bind:value={name} placeholder="required, must be unique" on:input />
  </label>
</fieldset>

<fieldset>
  <legend>How will passwords be encrypted?</legend>

  <label>
    Armored Public Key
    <textarea
      required
      name="armoredPublicKey"
      bind:value={armoredPublicKey}
      placeholder="required"
      on:input
    />
  </label>

  <div>
    You can get the public key using the command:<br />
    <code>gpg --armor --export [KEY_ID]</code>
  </div>
</fieldset>

<fieldset>
  <legend>How will passwords be decrypted?</legend>

  <label>
    Armored Private Key
    <textarea
      required
      name="armoredPrivateKey"
      bind:value={armoredPrivateKey}
      placeholder="required"
      on:input
    />
  </label>

  <div>
    You can get the private key using the command:<br />
    <code>gpg --armor --export-secret-keys [KEY_ID]</code>
  </div>
</fieldset>
