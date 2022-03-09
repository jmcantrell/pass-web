<script>
	export let items = [];
</script>

{#if items.length > 0}
	<ul class="error">
		{#each items as item}
			<li>{item}</li>
		{/each}
	</ul>
{/if}
