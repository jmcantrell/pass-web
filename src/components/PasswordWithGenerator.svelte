<script>
	import { onMount } from "svelte";
	import { generate } from "@/lib/password";
	import Password from "@/components/Password";
	import PasswordGenerationFields from "@/components/PasswordGenerationFields";
	import { defaults, default as setting } from "@/local/settings/defaultPasswordGeneratorOptions";

	export let password = "";
	export let visible = false;

	let { length, classes } = defaults;

	onMount(() => {
		length = $setting.length;
		classes = $setting.classes;
	});
</script>

<Password value={password} {visible} on:input>
	<button type="button" on:click={() => (password = generate(length, classes))}>Generate</button>
</Password>

<details>
	<summary>Password Generation Options</summary>
	<div class="column">
		<PasswordGenerationFields bind:length bind:classes />
	</div>
</details>

<style>
	details > div.column {
		padding-block-start: var(--s0);
		gap: var(--s0);
	}
</style>
