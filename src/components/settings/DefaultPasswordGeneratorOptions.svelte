<script context="module">
	export const title = "Default Password Generator Options";
</script>

<script>
	import PasswordGenerationFields from "@/components/PasswordGenerationFields";
	import setting from "@/local/settings/defaultPasswordGeneratorOptions";
</script>

<PasswordGenerationFields bind:length={$setting.length} bind:classes={$setting.classes} />
