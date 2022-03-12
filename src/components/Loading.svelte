<script>
	export let name = null;
</script>

<p class="loading">
	<slot>
		Loading{#if name} {name}{/if}...
	</slot>
</p>
