<script context="module">
	export const path = "passwords/view";

	export function title({ query }) {
		return `View Password: ${query.get("source")}/${query.get("name")}`;
	}
</script>

<script>
	import { onMount } from "svelte";
	import { copy } from "@/lib/clipboard";
	import Link from "@/components/Link";
	import EnsurePassword from "@/components/EnsurePassword";
	import PasswordLastUpdated from "@/components/PasswordLastUpdated";
	import PassphraseProtected from "@/components/PassphraseProtected";
	import * as editPassword from "@/routes/EditPassword";
	import * as regeneratePassword from "@/routes/RegeneratePassword";
	import stores from "@/local/stores";
	import sources from "@/local/sources";

	export let query;

	let source, name, key;

	onMount(async () => {
		source = query.get("source");
		name = query.get("name");
		key = $sources[source].key;
	});

	async function onCopyButtonClick() {
		const store = $stores[source];
		const content = await store.get(name);
		const lines = content.split("\n");
		await copy(lines[0]);
	}
</script>

<EnsurePassword {source} {name}>
	<PassphraseProtected {key}>
		<button on:click={onCopyButtonClick}>Copy password to clipboard</button>

		<h2>Actions</h2>
		<ul>
			<li><Link to={editPassword} query={{ source, name }}>Decrypt and edit content</Link></li>
			<li><Link to={regeneratePassword} query={{ source, name }}>Regenerate password</Link></li>
		</ul>
	</PassphraseProtected>

	<h2>Last Updated</h2>
	<PasswordLastUpdated {source} {name} />
</EnsurePassword>
