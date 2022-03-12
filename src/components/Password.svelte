<script>
	export let label = "Password";
	export let name = "password";
	export let value = "";
	export let visible = false;
</script>

<label for="password">
	{label}
	<div>
		<input id="password" type={visible ? "text" : "password"} {name} {value} on:input required />
		<button type="button" on:click={() => (visible = !visible)}>{visible ? "Hide" : "Show"}</button>
		<slot />
	</div>
</label>

<style>
	div {
		display: flex;
		gap: var(--s-1);
	}
	input {
		flex-grow: 1;
	}
</style>
