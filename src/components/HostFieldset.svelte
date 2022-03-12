<script>
	import * as details from "@/lib/hosts";
	import * as components from "@/components/hosts";

	export let id;
	export let options = {};
</script>

<fieldset>
	<legend>How can the store be accessed at {details[id].name}?</legend>
	<svelte:component this={components[id].default} {...options} on:input />
</fieldset>
