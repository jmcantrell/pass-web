<script>
  import stores from "@/local/stores";
  import options from "@/local/options";

  function lockAllStores() {
    for (const store of Object.values($stores)) {
      store.lock();
    }
  }

  function onVisibilityChange() {
    if ($options.locker.enabled && document.hidden) {
      if ($options.locker.timeout === 0) {
        lockAllStores();
      } else {
        timeoutHandle = setTimeout(lockAllStores, $options.locker.timeout * 1000);
      }
    } else {
      clearTimeout(timeoutHandle);
    }
  }

  let timeoutHandle;

  options.subscribe(($options) => {
    onVisibilityChange();
    if ($options.locker.enabled) {
      document.addEventListener("visibilitychange", onVisibilityChange);
    } else {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
  });
</script>
