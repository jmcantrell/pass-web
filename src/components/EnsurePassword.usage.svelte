<script>
  import EnsurePassword from "./EnsurePassword";
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
