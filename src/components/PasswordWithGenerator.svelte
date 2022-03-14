<script>
	import { onMount } from "svelte";
	import { generate } from "@/lib/password";
	import { defaults } from "@/lib/settings/defaultPasswordGeneratorOptions";
	import Password from "@/components/Password";
	import PasswordGenerationFields from "@/components/PasswordGenerationFields";
	import setting from "@/local/settings/defaultPasswordGeneratorOptions";

	export let password = "";
	export let visible = false;

	let { length, classes } = defaults;

	let input;

	onMount(() => {
		length = $setting.length;
		classes = $setting.classes;
	});

	function onButtonClick() {
		password = generate(length, classes);
		input.dispatchEvent(new Event("input"));
	}
</script>

<Password bind:input value={password} {visible} on:input>
	<button type="button" on:click={onButtonClick}>Generate</button>
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
