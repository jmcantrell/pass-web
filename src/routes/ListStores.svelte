<script context="module">
  export const path = "stores";
</script>

<script>
  import Link from "@/components/Link";
  import { path as listPasswords } from "@/routes/ListPasswords";
  import sources from "@/local/sources";
</script>

<h1>Password Stores</h1>

{#await Object.keys($sources) then names}
  {#if names.length > 0}
    <ul id="list">
      {#each names as source}
        <li><Link path={listPasswords} query={{ source }}>{source}</Link></li>
      {/each}
    </ul>
  {:else}
    <p>There are no password stores defined.</p>
  {/if}
{/await}
