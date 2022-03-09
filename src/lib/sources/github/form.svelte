<script>
	export let repo, branch, token;
</script>

<label>
	Repository
	<input
		name="repo"
		bind:value={repo}
		placeholder="required, example: user/password-store"
		required
	/>
</label>

<label>
	Branch
	<input
		name="branch"
		bind:value={branch}
		placeholder="required, example: main or master"
		required
	/>
</label>

<label>
	Access Token
	<input
		name="token"
		bind:value={token}
		type="password"
		placeholder="required for private repos"
		autocomplete="new-password"
	/>
	<small>
		<a target="_blank" href="https://github.com/settings/tokens/new"
			>Generate a personal access token</a
		>
	</small>
</label>
