<script>
	import { onMount } from "svelte";
	import stores from "@/local/stores";
	import settings from "@/local/settings";

	let timeout;

	onMount(() => {
		document.addEventListener("visibilitychange", onVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	});

	function lockAllStores() {
		for (const store of Object.values($stores)) {
			store.lock();
		}
	}

	function onVisibilityChange() {
		switch (document.visibilityState) {
			case "hidden":
				timeout = setTimeout(lockAllStores, $settings.secondsUntilLockAfterVisibilityLoss * 1000);
				break;
			case "visible":
				clearTimeout(timeout);
				break;
		}
	}
</script>
