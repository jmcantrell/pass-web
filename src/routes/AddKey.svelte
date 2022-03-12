<script context="module">
	export const path = "keys/add";
</script>

<script>
	import { redirect } from "@/lib/routing";
	import { formToObject, setValidity, clearValidity } from "@/lib/form";
	import KeyFieldsets from "@/components/KeyFieldsets";
	import { path as editKey } from "@/routes/EditKey";
	import keys from "@/local/keys";

	const title = "Add Cryptography Key";

	function onSubmit(event) {
		const form = event.target;
		const { name, ...options } = formToObject(form);

		if ($keys[name]) {
			setValidity(form, "name", "A key with that name already exists.");
			return;
		}

		$keys[name] = { options, updated: new Date() };
		redirect(editKey, { query: { name } });
	}
</script>

<h1>{title}</h1>

<form on:submit|preventDefault={onSubmit}>
	<fieldset>
		<legend>How would you like to refer to this key?</legend>
		<label>
			Key Name
			<input
				required
				name="name"
				autocomplete="off"
				placeholder="required, must be unique"
				on:input={clearValidity}
			/>
		</label>
	</fieldset>

	<KeyFieldsets />

	<input type="submit" value="Add Key" />
</form>
