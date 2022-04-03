import { string } from "yup";

export function getTag(where, name) {
  return `-----${where.toUpperCase()} PGP ${name.toUpperCase()}-----`;
}

export function getTagRegExp(name) {
  return new RegExp(`\\s*${getTag("begin", name)}[a-zA-Z0-9+/=\r\n]+${getTag("end", name)}\\s*`);
}

function createArmorSchema(name) {
  return string().required().matches(getTagRegExp(name), `Invalid ${name}.`);
}

export const armoredPublicKey = createArmorSchema("public key block");
export const armoredPrivateKey = createArmorSchema("private key block");
