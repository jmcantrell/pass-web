<script>
	export let items = [];
</script>

{#if items.length > 0}
	<ul class="errors">
		{#each items as item}
			<li>{item}</li>
		{/each}
	</ul>
{/if}
