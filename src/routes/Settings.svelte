<script context="module">
  export const path = "settings";
</script>

<script>
  import Link from "@/components/Link";
  import * as optionConfigurators from "@/components/options";
  import { path as addKey } from "@/routes/AddKey";
  import { path as editKey } from "@/routes/EditKey";
  import { path as addStore } from "@/routes/AddStore";
  import { path as editStore } from "@/routes/EditStore";
  import { path as importSettings } from "@/routes/ImportSettings";
  import { path as exportSettings } from "@/routes/ExportSettings";
  import keys from "@/local/keys";
  import sources from "@/local/sources";
  import options from "@/local/options";

  function onResetButtonClick() {
    if (confirm("Reset settings to default values?")) {
      options.reset();
    }
  }
</script>

<h1>Settings</h1>

<details class="box">
  <summary>Cryptography Keys</summary>
  <ul>
    {#each Object.keys($keys) as name}
      <li><Link path={editKey} query={{ name }}>{name}</Link></li>
    {/each}
  </ul>
  <Link path={addKey}>Add Key</Link>
</details>

<details class="box">
  <summary>Password Stores</summary>
  <ul>
    {#each Object.keys($sources) as name}
      <li><Link path={editStore} query={{ name }}>{name}</Link></li>
    {/each}
  </ul>
  <Link path={addStore}>Add Store</Link>
</details>

<details class="box">
  <summary>Options</summary>
  <div>
    {#each Object.entries(optionConfigurators) as [id, { title, default: component }] (id)}
      <details class="box">
        <summary>{title}</summary>
        <div>
          <svelte:component this={component} />
        </div>
      </details>
    {/each}
    <button on:click={onResetButtonClick}>Reset to Default</button>
  </div>
</details>

<nav>
  <Link path={importSettings}>Import Settings</Link>
  <Link path={exportSettings}>Export Settings</Link>
</nav>
