<script>
  import EnsurePassword from "./EnsurePassword";
  import stores from "@/local/stores";

  stores.set = () => {};

  $stores.foo = {
    has: (name) => {
      if (name == "bogus") return false;
      if (name == "bar") return true;
      return new Promise(() => {});
    }
  };
</script>

<EnsurePassword source="bogus" name="does not matter">
  <h1>Should Not Be Visible</h1>
</EnsurePassword>

<EnsurePassword source="foo" name="bogus">
  <h1>Should Not Be Visible</h1>
</EnsurePassword>

<EnsurePassword source="foo" name="wait-forever">
  <h1>Should Not Be Visible</h1>
</EnsurePassword>

<EnsurePassword source="foo" name="bar">
  <h1>Password Exists</h1>
</EnsurePassword>
