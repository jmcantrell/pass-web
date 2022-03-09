import { createSettingStore } from "@/lib/svelte/store";

export default createSettingStore("lockStoresAfterVisibilityLoss", {
	enabled: true,
	timeout: 45
});
