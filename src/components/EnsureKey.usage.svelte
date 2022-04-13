<script>
  import EnsureKey from "./EnsureKey";
  import keys from "@/local/keys";

  keys.set({ foo: "value is not used" }); 
</script>

<EnsureKey name="bogus">
  <h1>Should Not Be Visible</h1>
</EnsureKey>

<EnsureKey name="foo">
  <h1>Key Exists</h1>
</EnsureKey>
