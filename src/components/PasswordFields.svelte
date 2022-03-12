<script>
	import PasswordWithGenerator from "@/components/PasswordWithGenerator";

	export let password, extra;
</script>

<PasswordWithGenerator bind:password on:input />

<label>
	Extra Content
	<textarea
		name="extra"
		bind:value={extra}
		placeholder="optional, extra lines encrypted along with the password"
		on:input
	/>
</label>
