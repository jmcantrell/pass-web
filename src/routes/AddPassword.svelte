<script context="module">
	export const path = "passwords/generate";
</script>

<script>
	import { onMount } from "svelte";
	import { navigate } from "@/lib/routing";
	import { formToObject, setValidity, clearValidity } from "@/lib/form";
	import EnsureStore from "@/components/EnsureStore";
	import PasswordFields from "@/components/PasswordFields";
	import { path as editPassword } from "@/routes/EditPassword";
	import stores from "@/local/stores";
	import sources from "@/local/sources";

	export let query;

	let source, key, title;

	onMount(() => {
		source = query.get("source");
		key = $sources[source].key;
		title = `Add Password: ${source}`;
	});

	async function onSubmit(event) {
		const form = event.target;
		const { name, ...data } = formToObject(form);
		const store = $stores[source];

		if (await store.has(name)) {
			setValidity(form, "name", "A password with that name already exists.");
			return;
		}

		await store.set(name, data);
		navigate(editPassword, { query: { source, name } });
	}
</script>

<EnsureStore name={source}>
	<h1>{title}</h1>

	<form on:submit|preventDefault={onSubmit} class="column">
		<fieldset class="column">
			<legend>Where would you like this password stored?</legend>
			<label class="column">
				Password Name
				<input
					required
					name="name"
					maxlength="256"
					autocomplete="off"
					placeholder="required, example: domain.net/username"
					on:input={clearValidity}
				/>
			</label>
		</fieldset>

		<fieldset>
			<legend>What would you like stored?</legend>
			<PasswordFields />
		</fieldset>

		<input type="submit" value="Add Password" />
	</form>
</EnsureStore>
