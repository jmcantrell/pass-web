import { object, string } from "yup";
import providers from "@/lib/providers";
import schemas from "@/schemas/providers";

const validProviders = Object.keys(providers);

const validKey = {
  name: "valid-key",
  message: "Invalid key.",
  test: (name, { options }) => !!options.context.keys[name]
};

export default object({
  key: string().required("Key is required.").test(validKey),
  provider: string().required("Provider is required.").oneOf(validProviders, "Invalid provider.")
})
  .test({
    name: "valid-provider",
    message: "Provider options are invalid.",
    test: (value, { options }) => schemas[value.provider].validateSync(value, options.context)
  })
  .required();
