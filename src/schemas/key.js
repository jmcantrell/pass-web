import { object } from "yup";
import { armoredPublicKey, armoredPrivateKey } from "@/schemas/pgp";

export default object({ armoredPublicKey, armoredPrivateKey }).required();
