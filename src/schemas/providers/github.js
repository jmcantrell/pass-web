import { object, string } from "yup";

export default object({
  repository: string()
    .required("Repository path is required.")
    .matches(/^[^/]+\/[^/]+$/, "Invalid repository path."),
  branch: string().required("Branch name is required."),
  token: string()
}).required();
