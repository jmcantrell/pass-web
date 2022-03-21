<script context="module">
  export const path = "";
</script>

<script>
  import { name, homepage, bugs } from "@/lib/app";
  import Link from "@/components/Link";
  import * as providerForms from "@/components/providers";
  import { path as addKey } from "@/routes/AddKey";
  import { path as addStore } from "@/routes/AddStore";
  import keys from "@/local/keys";
  import stores from "@/local/stores";

  $: hasKey = Object.keys($keys).length > 0;
  $: hasStore = Object.keys($stores).length > 0;
  $: ready = hasKey && hasStore;
  $: providerTitles = Object.values(providerForms).map(({ title }) => title);
  $: exampleProviders = providerTitles.slice(0, 2).join(" or ");
</script>

<h1>Welcome to {name}!</h1>

<section id="intro">
  <h2>Introduction</h2>
  <p>
    This application provides a way to access your hosted
    <a target="_blank" href="https://www.passwordstore.org/">password stores</a> remotely via a web browser.
    This is primarily useful for devices that do not have access to a unix shell (in my case, an iPhone
    and iPad).
  </p>
</section>

<section id="security-precautions">
  <h2>Security Precautions</h2>
  <p>
    This application deals with highly sensitive information, namely your authentication
    credentials. You <strong>should</strong> be concerned about how this application handles that information.
  </p>

  <p>Every attempt is made to handle your information as securely as possible:</p>

  <ul>
    <li>All application data is stored locally.</li>
    <li>The only remote communication is to the password store hosts (e.g. {exampleProviders}).</li>
    <li>No unencrypted data is kept or transmitted.</li>
    <li>Password stores stay unlocked for, at most, the lifetime of application session.</li>
    <li>
      By default, password stores are automatically locked when the application loses visibility.
    </li>
  </ul>

  <p>
    Feel free to inspect the
    <a target="_blank" href={homepage}>source code</a>. I welcome any input you might have. You can
    even host a copy of it on your own server, if you're so inclined.
  </p>
</section>

<section id="steps">
  <h2>Initial Steps</h2>
  <p>Before the application can be used, you'll need to do a little bit of configuration.</p>
  <ol>
    <li>
      {#if hasKey}
        Added a cryptography key ✔️
      {:else}
        <Link path={addKey}>Add a cryptography key</Link>
      {/if}
      <p>
        In order to encrypt and decrypt information in a password store, the application needs
        access to the public and private keys associated with it.
      </p>
    </li>
    <li>
      {#if hasStore}
        Added a password store ✔️
      {:else}
        <Link path={addStore}>Add a password store</Link>
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

<section id="issues">
  <h2>Problems?</h2>
  <p>
    If you encounter any issues using this application or just have a suggestion,
    <a target="_blank" href={bugs}>open an issue</a>.
  </p>
</section>
