<script>
  import { createEventDispatcher } from "svelte";

  export let acknowledgement = false;

  const dispatch = createEventDispatcher();
</script>

<div>
  <span />
  <span><slot /></span>
  {#if acknowledgement}
    <span><button on:click={() => dispatch("acknowledge")}>OK</button></span>
  {/if}
</div>

<style>
  div {
    display: flex;
    border: 1px dotted;
    padding: var(--s0);
  }

  div > span:nth-child(2) {
    flex-grow: 1;
    padding-left: var(--s0);
    padding-right: var(--s0);
  }

  div > span:first-child::before {
    content: "🔔";
  }
</style>
