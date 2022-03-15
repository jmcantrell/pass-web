<script context="module">
	export const path = "settings/import";
</script>

<script>
	import Password from "@/components/Password";

	async function onSubmit(event) {
		const form = event.target;
		const data = await form.elements["file"].files[0].text();
		console.debug(data);
	}
</script>

<h1>Import Settings</h1>

<form on:submit|preventDefault={onSubmit}>
	<fieldset>
		<legend>Import Settings</legend>
		<label>
			Export File
			<input type="file" name="file" required />
		</label>
		<Password label="Decryption Passphrase" name="passphrase" required={false} />
	</fieldset>
	<input type="submit" value="Upload File" />
</form>
