<script context="module">
  export const title = "PGP Encryption Compression";
</script>

<script>
  import { enums } from "openpgp";
  import options from "@/local/options";
</script>

<label>
  Compression Algorithm
  <select bind:value={$options.crypto.compression.algorithm}>
    {#each Object.entries(enums.compression) as [name, value]}
      <option {value}>{name}</option>
    {/each}
  </select>
</label>

<label>
  Deflate Level: {$options.crypto.compression.level}
  <input type="range" min="1" max="9" bind:value={$options.crypto.compression.level} />
</label>
