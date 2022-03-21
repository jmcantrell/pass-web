import { string } from "yup";

function getKeyBlockTag(type, name) {
  return `-----${type.toUpperCase()} PGP ${name.toUpperCase()} KEY BLOCK-----`;
}

function createKeySchema(name) {
  const begin = getKeyBlockTag("begin", name);
  const end = getKeyBlockTag("end", name);
  const regex = new RegExp(`\\s*${begin}[a-zA-Z0-9+/=\r\n]+${end}\\s*`);
  return string().required().matches(regex, `Invalid ${name} key.`);
}

export const armoredPublicKey = createKeySchema("public");
export const armoredPrivateKey = createKeySchema("private");
