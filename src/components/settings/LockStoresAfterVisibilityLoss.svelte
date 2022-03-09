<script context="module">
	export const title = "Lock stores after visibility loss";
</script>

<script>
	import setting from "@/local/settings/lockStoresAfterVisibilityLoss";
</script>

<label class="row">
	<input type="checkbox" bind:checked={$setting.enabled} />
	Enabled
</label>

<label>
	Seconds to wait before locking
	<input type="number" min="0" max={60 * 60 * 24} size="0" bind:value={$setting.timeout} />
</label>
