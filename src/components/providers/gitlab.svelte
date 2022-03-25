<script context="module">
  export const title = "GitLab";
</script>

<script>
  import Password from "@/components/Password";

  export let repo, branch, token;
</script>

<label>
  Repository
  <input
    required
    name="repo"
    bind:value={repo}
    placeholder="required, example: user/project or 12345678"
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
  <a target="_blank" href="https://gitlab.com/-/profile/personal_access_tokens">
    Generate a Personal Access Token
  </a>
</Password>
