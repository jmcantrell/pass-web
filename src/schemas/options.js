import { object, string, boolean, number, array } from "yup";
import { classes } from "@/lib/pwgen";
import { enums, config } from "openpgp";

const classIDs = Object.keys(classes);
const classSchema = string().oneOf(classIDs);

export default object({
  crypto: object({
    compression: object({
      algorithm: number()
        .oneOf(Object.values(enums.compression))
        .default(enums.compression.uncompressed),
      level: number().min(1).max(9).default(config.deflateLevel)
    })
  }),
  locker: object({
    enabled: boolean().required().default(true),
    timeout: number().required().default(45)
  }),
  pwgen: object({
    length: number().required().min(0).truncate().default(16),
    classes: array().required().of(classSchema).default(classIDs)
  })
});
