<script>
  import EnsureStore from "./EnsureStore";
</script>

<EnsureStore name="bogus">
  <h1>Should Not Be Visible</h1>
</EnsureStore>

<EnsureStore name="foo">
  <h1>Store Exists</h1>
</EnsureStore>
