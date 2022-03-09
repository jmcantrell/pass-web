<script>
	import { characterClasses } from "@/lib/password";
	export let classes = Object.keys(characterClasses);
	export let length = 8;
</script>

<label>
	Password Length
	<input type="number" name="length" value={length} min="0" max="256" required />
</label>

<label>
	Character Classes
	<select name="classes" value={classes.join(",")} multiple required>
		{#each Object.entries(characterClasses) as [id, { name }] (id)}
			<option value={id} selected>{name}</option>
		{/each}
	</select>
</label>
