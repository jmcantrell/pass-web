<script>
  import Link from "./Link";
  export let path;
</script>

<!-- Every href will be prefixed with BASE_URL. -->

<!-- Link text defaults to the generated href -->
<Link {path} />

<!-- Simple links are not much different than <a>. -->
<Link {path}>Simple</Link>

<!-- Query objects will be converted to search parameters and appended. -->
<Link {path} query={{ foo: 1, bar: "a" }}>With Query</Link>
