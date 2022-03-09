<script context="module">
	export const path = "settings";
	export const title = "Settings";
</script>

<script>
	import components from "@/components/settings";
	import * as stores from "@/local/settings";

	function onResetButtonClick() {
		if (confirm("Reset all settings to default values?")) {
			for (const store of Object.values(stores)) {
				store.reset();
			}
		}
	}
</script>

{#each components as { title, default: component } (title)}
	<fieldset class="setting">
		<legend>{title}</legend>
		<svelte:component this={component} />
	</fieldset>
{/each}

<button on:click={onResetButtonClick}>Reset all settings to default values</button>
