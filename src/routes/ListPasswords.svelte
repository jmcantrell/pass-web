<script context="module">
  export const path = "passwords";
</script>

<script>
  import { onMount } from "svelte";
  import Link from "@/components/Link";
  import Loading from "@/components/Loading";
  import Error from "@/components/Error";
  import Message from "@/components/Message";
  import EnsureStore from "@/components/EnsureStore";
  import stores from "@/local/stores";
  import createPageStore from "@/session/pages";
  import { path as addPassword } from "@/routes/AddPassword";
  import { path as editPassword } from "@/routes/EditPassword";

  export let source;

  let fetchList = Promise.resolve();

  $: store = $stores[source];
  $: listSession = createPageStore({}, path, { query: { source } });

  onMount(() => {
    load();
  });

  function load() {
    fetchList = store.list();
  }
</script>

<EnsureStore name={source}>
  <h1>Password Store: {source}</h1>

  {#if $listSession.changed}
    <section id="notifications">
      <Message acknowledgement={true} on:acknowledge={() => ($listSession.changed = false)}>
        This store has been modified recently. It may take a moment for this change to be reflected
        in the list.
      </Message>
    </section>
  {/if}

  <section id="actions">
    <h2>Actions</h2>
    <nav>
      <button on:click={load}>Refresh List</button>
      <Link path={addPassword} query={{ source }}>Add Password</Link>
    </nav>
  </section>

  {#await fetchList}
    <Loading name="passwords" />
  {:then names}
    <section id="list">
      <h2>Select Password</h2>
      <ul>
        {#each names as name}
          <li><Link path={editPassword} query={{ source, name }}>{name}</Link></li>
        {/each}
      </ul>
    </section>
  {:catch error}
    <Error>{error}</Error>
  {/await}
</EnsureStore>
