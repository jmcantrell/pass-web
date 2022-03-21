import { object, string } from "yup";

export default object({
  password: string().required("Password is required."),
  extra: string()
}).required();
