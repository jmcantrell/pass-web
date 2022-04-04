import { object } from "yup";
import { publicKey, privateKey } from "@/schemas/pgp";

export default object({ publicKey, privateKey }).required();
