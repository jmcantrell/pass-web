<script>
  import { classes as allClasses } from "@/lib/pwgen";

  export let length, classes;
</script>

<label>
  Password Length
  <input type="number" bind:value={length} min="0" max="256" required />
</label>

<label>
  Character Classes
  <select bind:value={classes} multiple required>
    {#each Object.entries(allClasses) as [id, { name }] (id)}
      <option value={id} selected>{name}</option>
    {/each}
  </select>
</label>
