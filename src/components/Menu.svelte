<script>
  import Link from "@/components/Link";
  import { path as home } from "@/routes/Home";
  import { path as listStores } from "@/routes/ListStores";
  import { path as settings } from "@/routes/Settings";
</script>

<section id="menu">
  <nav>
    <Link path={home}>Home</Link>
    <Link path={listStores}>Password Stores</Link>
    <Link path={settings}>Settings</Link>
  </nav>
</section>
