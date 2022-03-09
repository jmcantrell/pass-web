<script>
	export let armoredPublicKey, armoredPrivateKey;
</script>

<label>
	Public Key
	<textarea
		name="armoredPublicKey"
		bind:value={armoredPublicKey}
		placeholder="required"
		rows="10"
		required
	/>
</label>

<label>
	Private Key
	<textarea
		name="armoredPrivateKey"
		bind:value={armoredPrivateKey}
		placeholder="required"
		rows="10"
		required
	/>
</label>
