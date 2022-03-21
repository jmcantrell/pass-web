import { object, string } from "yup";
import * as providers from "@/lib/providers";
import * as providerSchemas from "@/schemas/providers";

const providerIDs = Object.keys(providers);

const validKey = {
  name: "valid-key",
  message: "Invalid key.",
  test: (name, { options }) => !!options.context.keys[name]
};

export default object({
  key: string().required("Key is required.").test(validKey),
  provider: string().required("Provider is required.").oneOf(providerIDs, "Invalid provider.")
})
  .test({
    name: "valid-provider",
    message: "Provider options are invalid.",
    test: (value, { options }) =>
      providerSchemas[value.provider].validateSync(value, options.context)
  })
  .required();
