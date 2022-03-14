<script>
	export let input;
	export let label = "Password";
	export let name = "password";
	export let value = "";
	export let visible = false;
	export let required = true;
</script>

<label for="password">
	{label}
	<div>
		<input
			bind:this={input}
			id="password"
			type={visible ? "text" : "password"}
			{name}
			{value}
			{required}
			on:input
		/>
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
