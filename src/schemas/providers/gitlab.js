import { object, string } from "yup";

export default object({
  repo: string()
    .required("Repository path is required.")
    .matches(/^([^/]+\/[^/]+|[0-9]+)$/, "Invalid repository."),
  branch: string().required("Branch is required."),
  token: string().required("Access token is required."),
}).required();
