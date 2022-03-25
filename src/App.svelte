<script>
  import { name } from "@/lib/app";
  import Link from "@/components/Link";
  import Router from "@/components/Router";
  import Locker from "@/components/Locker";
  import { path as home } from "@/routes/Home";
  import { path as listStores } from "@/routes/ListStores";
  import { path as settings } from "@/routes/Settings";

  let component, params;
</script>

<svelte:head>
  <title>{name}</title>
</svelte:head>

<Router bind:component bind:params />

<Locker />

<header>
  <section id="menu">
    <nav>
      <Link path={home}>Home</Link>
      <Link path={listStores}>Password Stores</Link>
      <Link path={settings}>Settings</Link>
    </nav>
  </section>
</header>

<main>
  <svelte:component this={component} {...params} />
</main>
