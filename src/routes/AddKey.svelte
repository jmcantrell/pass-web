<script>
	import { navigate } from "svelte-routing";
	import { objectFromForm } from "@/lib/form";
	import { keys } from "@/lib/localStorage";
	import GPGKey from "@/components/GPGKey";

	function save(event) {
		const { name, ...options } = objectFromForm(event.target);

		if (!$keys[name] || confirm("Overwrite existing key?")) {
			$keys[name] = { options, updated: new Date() };
			navigate(`/keys/edit/${name}`, { replace: true });
		}
	}
</script>

<h1>Add encryption key</h1>

<form on:submit|preventDefault={save}>
	<label for="name">Name</label>
	<input id="name" name="name" placeholder="required, must be unique" autocomplete="off" required />
	<GPGKey />
	<input type="submit" value="Save" />
</form>

<style>
	form {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 1em;
	}

	form input[type="submit"] {
		grid-column: 1 / span 2;
	}
</style>
