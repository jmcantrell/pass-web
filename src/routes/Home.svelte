<script context="module">
	export const path = "";
	export const title = "Welcome!";
</script>

<script>
	import * as sourceTypes from "@/lib/sources";
	import Link from "@/components/Link";
	import * as addKey from "@/routes/AddKey";
	import * as addSource from "@/routes/AddSource";
	import keys from "@/local/keys";
	import sources from "@/local/sources";

	$: hasKey = Object.keys($keys).length > 0;
	$: hasSource = Object.keys($sources).length > 0;
	$: ready = hasKey && hasSource;
	$: sourceNames = Object.values(sourceTypes).map(({ name }) => name);
	$: exampleSources = sourceNames.slice(0, 2).join(" or ");
</script>

<section id="intro">
	<h2>Introduction</h2>
	<p>
		This application provides a way to access your hosted
		<a target="_blank" href="https://www.passwordstore.org/">password stores</a> via a web browser. This
		is primarily useful for devices that do not have access to a unix shell (in my case, an iPhone and
		iPad).
	</p>
</section>

{#if !ready}
	<section id="get-started">
		<h2>Get Started</h2>
		<p>Before the application can be used, you'll need to do a little bit of configuration.</p>
		<p>Take note of the following security precautions, then follow the required steps.</p>
	</section>
{/if}

<section id="security-precautions">
	<h2>Security Precautions</h2>
	<p>
		This application deals primarily with, what most would consider, highly sensitive information,
		namely authentication credentials. I would be surprised if you weren't, at least, a little
		concerned.
	</p>

	<ul>
		<li>There is no back end server, so there's no phoning home.</li>
		<li>
			All configuration (including, but not limited to application settings, cryptography keys, and
			password store information) is only kept locally.
		</li>
		<li>The only remote communication is to the password store hosts (e.g. {exampleSources}).</li>
		<li>No unencrypted data is kept or transmitted.</li>
		<li>
			Password stores only stay unlocked for, at most, the lifetime of application session and are
			automatically locked when the application's visibility is lost.
		</li>
	</ul>

	<p>
		Feel free to inspect the
		<a target="_blank" href="https://github.com/jmcantrell/pass-web">source code</a>. I welcome any
		input you might have. You can even host a copy of it on your own server, if you're so inclined.
	</p>
</section>

<section id="steps">
	<h2>Initial Steps</h2>
	<ol>
		<li>
			{#if hasKey}
				Added a cryptography key ✔️
			{:else}
				<Link to={addKey}>Add a cryptography key</Link>
			{/if}
			<p>
				In order to encrypt and decrypt information in a password store, the application needs
				access to the public and private keys associated with it.
			</p>
		</li>
		<li>
			{#if hasSource}
				Added a password store ✔️
			{:else}
				<Link to={addSource}>Add a password store</Link>
			{/if}
			<p>
				Password stores must be hosted using one of the supported providers. The application will
				need details on how to find the store, such as a repository path and a personal access
				token.
			</p>
		</li>
	</ol>
</section>

{#if ready}
	<section id="finished">
		<h2>Finished!</h2>
		<p>You've completed the necessary steps and the application is ready to use.</p>
	</section>
{/if}
