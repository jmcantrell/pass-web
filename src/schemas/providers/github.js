import { object, string } from "yup";

export default object({
  repo: string()
    .required("Repository path is required.")
    .matches(/^[^/]+\/[^/]+$/, "Invalid repository."),
  branch: string().required("Branch is required."),
  token: string().required("Access token is required."),
}).required();
