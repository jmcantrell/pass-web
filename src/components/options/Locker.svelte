<script context="module">
  export const title = "Lock Password Stores after Visibility Loss";
</script>

<script>
  import options from "@/local/options";
</script>

<label class="row">
  <input type="checkbox" bind:checked={$options.locker.enabled} />
  Enabled
</label>

<label>
  Seconds to Wait Before Locking
  <input type="number" min="0" max={60 * 60 * 24} size="0" bind:value={$options.locker.timeout} />
</label>
