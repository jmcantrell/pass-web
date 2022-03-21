<script context="module">
  export const title = "GitHub";
</script>

<script>
  import Password from "@/components/Password";

  export let repository, branch, token;
</script>

<label>
  Repository
  <input
    required
    name="repository"
    bind:value={repository}
    placeholder="required, example: user/password-store"
    on:input
  />
</label>

<label>
  Branch
  <input
    required
    name="branch"
    bind:value={branch}
    placeholder="required, example: main or master"
    on:input
  />
</label>

<Password
  label="Access Token"
  name="token"
  bind:value={token}
  placeholder="required for private repos"
  on:input
>
  <a target="_blank" href="https://github.com/settings/tokens/new">
    Generate a Personal Access Token
  </a>
</Password>
