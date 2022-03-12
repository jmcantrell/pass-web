import { createSettingStore } from "@/lib/svelte/store";
import { characterClasses } from "@/lib/password";

export const defaults = {
	length: 16,
	classes: Object.keys(characterClasses)
};

export default createSettingStore("defaultPasswordGeneratorOptions", defaults);
