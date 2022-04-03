<script>
  import { onMount } from "svelte";
  import pwgen from "@/lib/pwgen";
  import { copy } from "@/lib/clipboard";
  import Password from "@/components/Password";
  import NameField from "@/components/NameField";
  import PasswordGeneratorForm from "@/components/PasswordGeneratorForm";
  import options from "@/local/options";

  export let name = "";
  export let password = "";
  export let extra = "";

  let input;
  let visible = false;

  let length = 0;
  let classes = [];

  onMount(() => {
    length = $options.pwgen.length;
    classes = $options.pwgen.classes;
  });

  async function onCopyButtonClick() {
    await copy(password);
  }

  function onGenerateButtonClick() {
    password = pwgen({ length, classes });
    input.dispatchEvent(new Event("input"));
  }
</script>

<fieldset>
  <legend>Where would you like this password stored?</legend>
  <NameField required label="Password Name" value={name} pattern="[^/]+" on:input />
</fieldset>

<fieldset>
  <legend>What should be stored?</legend>

  <Password bind:input bind:value={password} {visible} on:input>
    <button slot="buttons" type="button" on:click={onGenerateButtonClick}>Generate</button>
    <button type="button" on:click={onCopyButtonClick}>Copy Password to Clipboard</button>
  </Password>

  <details>
    <summary>Password Generator Options</summary>
    <div>
      <PasswordGeneratorForm bind:length bind:classes />
    </div>
  </details>

  <label>
    Extra Content
    <textarea
      name="extra"
      bind:value={extra}
      placeholder="optional, extra lines encrypted along with the password"
      on:input
    />
  </label>
</fieldset>
