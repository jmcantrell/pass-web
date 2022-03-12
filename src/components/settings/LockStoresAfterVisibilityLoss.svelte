<script context="module">
	export const title = "Lock Stores after Visibility Loss";
</script>

<script>
	import setting from "@/local/settings/lockStoresAfterVisibilityLoss";
</script>

<label class="row">
	<input type="checkbox" bind:checked={$setting.enabled} />
	Enabled
</label>

<label>
	Seconds to Wait Before Locking
	<input type="number" min="0" max={60 * 60 * 24} size="0" bind:value={$setting.timeout} />
</label>
