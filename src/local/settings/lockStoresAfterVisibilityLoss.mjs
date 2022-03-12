import { createSettingStore } from "@/lib/svelte/store";

export const defaults = {
	enabled: true,
	timeout: 45
};

export default createSettingStore("lockStoresAfterVisibilityLoss", defaults);
