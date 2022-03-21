<script context="module">
  export const title = "Password Generator Defaults";
</script>

<script>
  import PasswordGeneratorForm from "@/components/PasswordGeneratorForm";
  import options from "@/local/options";
</script>

<PasswordGeneratorForm bind:length={$options.pwgen.length} bind:classes={$options.pwgen.classes} />
