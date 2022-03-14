import { createSettingStore } from "@/lib/svelte/store";
import { key, defaults } from "@/lib/settings/lockStoresAfterVisibilityLoss";

export default createSettingStore(key, defaults);
