<script>
	import { setValidity, clearValidity } from "@/lib/form";
	import Password from "@/components/Password";
	import cryptors from "@/local/cryptors";

	export let key;

	$: unlocked = $cryptors[key].isUnlocked();

	async function onSubmit(event) {
		const form = event.target;
		const passphrase = form.elements["passphrase"].value;
		const cryptor = $cryptors[key];

		try {
			await cryptor.unlock(passphrase);
			form.reset();
		} catch (e) {
			setValidity(form, "passphrase", e.message);
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
			<legend>Unlock Key: {key}</legend>
			<Password label="Passphrase" name="passphrase" on:input={clearValidity} />
		</fieldset>
		<input type="submit" value="Verify Passphrase" />
	</form>
{/if}
