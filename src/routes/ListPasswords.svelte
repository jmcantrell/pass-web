<script context="module">
	export const path = "passwords";

	export function title({ query }) {
		return `Passwords: ${query.get("source")}`;
	}
</script>

<script>
	import { onMount } from "svelte";
	import Link from "@/components/Link";
	import ErrorList from "@/components/ErrorList";
	import EnsureSource from "@/components/EnsureSource";
	import * as editSource from "@/routes/EditSource";
	import * as viewPassword from "@/routes/ViewPassword";
	import * as generatePassword from "@/routes/GeneratePassword";
	import stores from "@/local/stores";

	export let query;

	let source;

	onMount(() => {
		source = query.get("source");
	});
</script>

<EnsureSource name={source}>
	{#await $stores[source].list()}
		<p>Loading passwords...</p>
	{:then names}
		{#if names.length > 0}
			<h2>View Password</h2>
			<ul>
				{#each names as name}
					<li><Link to={viewPassword} query={{ source, name }}>{name}</Link></li>
				{/each}
			</ul>
		{/if}
	{:catch error}
		<ErrorList items={[error]} />
	{/await}

	<h2>Actions</h2>
	<ul>
		<li><Link to={generatePassword} query={{ source }}>Generate a new password</Link></li>
		<li><Link to={editSource} query={{ name: source }}>Edit source settings</Link></li>
	</ul>
</EnsureSource>
