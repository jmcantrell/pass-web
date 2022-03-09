<script context="module">
	export const path = "keys/add";
	export const title = "Add Key";
</script>

<script>
	import { redirect } from "@/lib/routing";
	import { formToObject } from "@/lib/form";
	import KeyForm from "@/components/KeyForm";
	import * as editKey from "@/routes/EditKey";
	import keys from "@/local/keys";

	function onSubmit(event) {
		const { name, ...options } = formToObject(event.target);
		if (!$keys[name] || confirm("Overwrite existing key?")) {
			$keys[name] = { options, updated: new Date() };
			redirect(editKey, { query: { name } });
		}
	}
</script>

<form on:submit|preventDefault={onSubmit}>
	<fieldset>
		<legend>Key Options</legend>
		<label>
			Name
			<input name="name" placeholder="required, must be unique" autocomplete="off" required />
		</label>
		<KeyForm />
		<input type="submit" value="Save" />
	</fieldset>
</form>
