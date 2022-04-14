<script>
  import EnsureKey from "./EnsureKey";
</script>

<EnsureKey name="bogus">
  <h1>Should Not Be Visible</h1>
</EnsureKey>

<EnsureKey name="foo">
  <h1>Key Exists</h1>
</EnsureKey>
