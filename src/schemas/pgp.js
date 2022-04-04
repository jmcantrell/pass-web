import { string } from "yup";

export function getTag(where, name) {
  return `-----${where.toUpperCase()} PGP ${name.toUpperCase()}-----`;
}

export function getBlockRegExp(name) {
  return new RegExp(`\\s*${getTag("begin", name)}[a-zA-Z0-9+/=\r\n]+${getTag("end", name)}\\s*`);
}

function createArmorSchema(name) {
  return string().required().matches(getBlockRegExp(name), `Invalid ${name}.`);
}

export const publicKey = createArmorSchema("public key block");
export const privateKey = createArmorSchema("private key block");
