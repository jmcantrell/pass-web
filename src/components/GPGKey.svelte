<script>
	export let publicKey, privateKey;
</script>

<label for="public-key">Public key</label>
<textarea
	id="public-key"
	name="publicKey"
	bind:value={publicKey}
	placeholder="required"
	rows="10"
	required
/>

<label for="private-key">Private key</label>
<textarea
	id="private-key"
	name="privateKey"
	bind:value={privateKey}
	placeholder="required"
	rows="10"
	required
/>
