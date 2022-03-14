import { characterClasses } from "@/lib/password";

export const key = "defaultPasswordGeneratorOptions";
export const title = "Default Password Generator Options";
export const defaults = { length: 16, classes: Object.keys(characterClasses) };
