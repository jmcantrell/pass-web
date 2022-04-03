<script>
  import Menu from "@/components/Menu";
  import Title from "@/components/Title";
  import Router from "@/components/Router";
  import Locker from "@/components/Locker";
  import routes from "@/routes";
</script>

<Title />
<Locker />

<header>
  <Menu />
</header>

<main>
  <Router {routes} />
</main>
