<script>
  import { onMount } from "svelte";
  import stores from "@/local/stores";
  import options from "@/local/options";

  let timeoutHandle;

  options.subscribe(($options) => {
    stopTimeout();
    if ($options.locker.enabled) {
      addVisibilityListener();
    } else {
      removeVisibilityListener();
    }
  });

  onMount(() => {
    addVisibilityListener();
    return () => {
      stopTimeout();
      removeVisibilityListener();
    };
  });

  function addVisibilityListener() {
    document.addEventListener("visibilitychange", onVisibilityChange);
  }

  function removeVisibilityListener() {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }

  function stopTimeout() {
    clearTimeout(timeoutHandle);
  }

  function lockAllStores() {
    for (const store of Object.values($stores)) {
      store.lock();
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState == "hidden") {
      timeoutHandle = setTimeout(lockAllStores, $options.locker.timeout * 1000);
    } else {
      stopTimeout();
    }
  }
</script>
