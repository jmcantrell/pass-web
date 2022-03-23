<script>
  export let name;
  export let label;
  export let value = "";
  export let required = false;
  export let placeholder = "";

  let fileInput, textInput;

  async function onButtonClick() {
    textInput.value = await fileInput.files[0].text();
  }
</script>

<label>
  {label}
  <textarea bind:this={textInput} {required} {name} {placeholder} bind:value on:input />
</label>

<label>
  Upload {label}
  <input bind:this={fileInput} type="file" />
  <button type="button" on:click={onButtonClick}>Upload File</button>
</label>
