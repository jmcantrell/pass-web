<script context="module">
	export const title = "Default password generator options";
</script>

<script>
	import PasswordGenerationForm from "@/components/PasswordGenerationForm";
	import setting from "@/local/settings/defaultPasswordGeneratorOptions";
</script>

<PasswordGenerationForm bind:length={$setting.length} bind:classes={$setting.classes} />
