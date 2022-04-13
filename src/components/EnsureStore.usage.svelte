<script>
  import EnsureStore from "./EnsureStore";
  import stores from "@/local/stores";

  stores.set = () => {};

  $stores.foo = "value does not matter";
</script>

<EnsureStore name="bogus">
  <h1>Should Not Be Visible</h1>
</EnsureStore>

<EnsureStore name="foo">
  <h1>Store Exists</h1>
</EnsureStore>
