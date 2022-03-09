import { createLocalStorageStore } from "@/lib/svelte/store";

export default createLocalStorageStore("settings", {
	secondsUntilLockAfterVisibilityLoss: 45
});
