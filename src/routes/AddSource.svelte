<script context="module">
	export const path = "sources/add";
	export const title = "Add Source";
</script>

<script>
	import { beforeUpdate } from "svelte";
	import { formToObject } from "@/lib/form";
	import { redirect } from "@/lib/routing";
	import * as sourceTypes from "@/lib/sources";
	import SourceForm from "@/components/SourceForm";
	import * as editSource from "@/routes/EditSource";
	import sources from "@/local/sources";

	export let query;

	let type;

	beforeUpdate(() => {
		type = query.get("type");
	});

	function onSubmit(event) {
		const { name, key, ...options } = formToObject(event.target);
		if (!$sources[name] || confirm("Overwrite existing source?")) {
			$sources[name] = { type, key, options, updated: new Date() };
			redirect(editSource, { query: { name } });
		}
	}
</script>

{#if type}
	<form on:submit|preventDefault={onSubmit}>
		<fieldset>
			<legend>{sourceTypes[type].name} Source Options</legend>
			<label>
				Name
				<input name="name" placeholder="required, must be unique" autocomplete="off" required />
			</label>
			<SourceForm {type} />
			<input type="submit" value="Save" />
		</fieldset>
	</form>
{:else}
	<h2>Select Source Type</h2>
	<ul>
		{#each Object.entries(sourceTypes) as [id, { name }] (id)}
			<li><a href="?type={id}">{name}</a></li>
		{/each}
	</ul>
{/if}
