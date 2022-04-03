<script context="module">
  export const path = "stores";
</script>

<script>
  import Link from "@/components/Link";
  import sources from "@/local/sources";
  import { path as listPasswords } from "@/routes/ListPasswords";
</script>

<h1>Password Stores</h1>

{#await Object.keys($sources) then names}
  {#if names.length > 0}
    <section id="list">
      <h2>Select Store</h2>
      <ul>
        {#each names as source}
          <li><Link path={listPasswords} query={{ source }}>{source}</Link></li>
        {/each}
      </ul>
    </section>
  {:else}
    <p>There are no password stores defined.</p>
  {/if}
{/await}
