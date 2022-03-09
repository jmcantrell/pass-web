import { createSettingStore } from "@/lib/svelte/store";
import { characterClasses } from "@/lib/password";

export default createSettingStore("defaultPasswordGeneratorOptions", {
	length: 8,
	classes: Object.keys(characterClasses)
});
