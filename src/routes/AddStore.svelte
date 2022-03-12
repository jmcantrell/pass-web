<script context="module">
	export const path = "stores/add";
</script>

<script>
	import { redirect } from "@/lib/routing";
	import { formToObject, setValidity, clearValidity } from "@/lib/form";
	import KeySelect from "@/components/KeySelect";
	import HostSelect from "@/components/HostSelect";
	import HostFieldset from "@/components/HostFieldset";
	import { path as editStore } from "@/routes/EditStore";
	import sources from "@/local/sources";

	let host;

	const title = "Add Password Store";

	function onSubmit(event) {
		const form = event.target;
		const { name, key, ...options } = formToObject(form);

		if ($sources[name]) {
			setValidity(form, "name", "A store with that name already exists.");
			return;
		}

		$sources[name] = { host, key, options, updated: new Date() };
		redirect(editStore, { query: { name } });
	}
</script>

<h1>{title}</h1>

<form on:submit|preventDefault={onSubmit}>
	<fieldset>
		<legend>How would you like to refer to this store?</legend>
		<label>
			Store Name
			<input
				required
				name="name"
				autocomplete="off"
				placeholder="required, must be unique"
				on:input={clearValidity}
			/>
		</label>
	</fieldset>

	<fieldset>
		<legend>How will the passwords be encrypted/decrypted?</legend>
		<KeySelect />
	</fieldset>

	<fieldset>
		<legend>Where is the store hosted?</legend>
		<HostSelect bind:id={host} />
	</fieldset>

	{#if host}
		<HostFieldset id={host} />
	{/if}

	<input type="submit" value="Add Store" />
</form>
