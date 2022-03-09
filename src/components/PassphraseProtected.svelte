<script>
	import cryptors from "@/local/cryptors";

	export let key;

	$: unlocked = $cryptors[key].isUnlocked();

	function onPassphraseInput(event) {
		// Clear previous validation message when typing.
		event.target.setCustomValidity("");
	}

	async function onSubmit(event) {
		const form = event.target;
		const input = form.elements["passphrase"];
		const passphrase = input.value;
		const cryptor = $cryptors[key];

		try {
			await cryptor.unlock(passphrase);
			form.reset();
		} catch (e) {
			input.setCustomValidity(e.message);
			input.reportValidity();
		} finally {
			unlocked = cryptor.isUnlocked();
		}
	}
</script>

{#if unlocked}
	<slot />
{:else}
	<form on:submit|preventDefault={onSubmit}>
		<fieldset>
			<legend>Unlock Key</legend>
			<label>
				Passphrase
				<input type="password" name="passphrase" on:input={onPassphraseInput} required />
			</label>
			<input type="submit" value="Submit" />
		</fieldset>
	</form>
{/if}
