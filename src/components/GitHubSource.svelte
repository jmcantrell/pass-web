<script>
	import KeySelector from "@/components/KeySelector";
	export let key, owner, repo, token;
</script>

<KeySelector {key} />

<label for="owner">Owner</label>
<input id="owner" name="owner" bind:value={owner} placeholder="required" required />

<label for="repo">Repository</label>
<input id="repo" name="repo" bind:value={repo} placeholder="required" required />

<label for="token">Access Token</label>
<input
	id="token"
	name="token"
	bind:value={token}
	type="password"
	placeholder="required for private repos"
	autocomplete="new-password"
/>
