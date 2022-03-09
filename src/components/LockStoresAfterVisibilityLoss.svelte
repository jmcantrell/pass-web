<script>
	import { onMount } from "svelte";
	import stores from "@/local/stores";
	import setting from "@/local/settings/lockStoresAfterVisibilityLoss";

	let timeoutHandle;

	setting.subscribe(($setting) => {
		stopTimeout();
		if ($setting.enabled) {
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
			timeoutHandle = setTimeout(lockAllStores, $setting.timeout * 1000);
		} else {
			stopTimeout();
		}
	}
</script>
