import { config as pgpConfig } from "openpgp";
import { createLocalStorageStore } from "@/lib/svelte/store";
import schema from "@/schemas/options";

function validate(options) {
  return schema.validateSync(options || {});
}

const options = createLocalStorageStore("options", { defaults: {}, validate });

options.subscribe(($options) => {
  if ($options.crypto.compression.algorithm) {
    pgpConfig.preferredCompressionAlgorithm = $options.crypto.compression.algorithm;
  }
  if ($options.crypto.compression.level) {
    pgpConfig.deflateLevel = $options.crypto.compression.level;
  }
});

export default options;
