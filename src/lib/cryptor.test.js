import { it, describe, expect, beforeAll, beforeEach } from "vitest";
import { generateKey } from "openpgp";
import { getTagRegExp } from "@/schemas/pgp";
import createCryptor from "./cryptor";

let armoredPublicKey, armoredPrivateKey, cryptor;
const passphrase = "test";
const userIDs = [{ name: "Jane Smith", email: "jane@domain.org" }];

const errorInvalidMessage = "Misformed armored text";
const errorIncorrectPassphrase = "Error decrypting private key: Incorrect key passphrase";
const regexpEncryptedMessage = getTagRegExp("message");

beforeAll(async () => {
  const key = await generateKey({ userIDs, passphrase });
  armoredPublicKey = key.publicKey;
  armoredPrivateKey = key.privateKey;
});

beforeEach(async () => {
  cryptor = await createCryptor({ armoredPublicKey, armoredPrivateKey });
});

it("should refuse to decrypt an invalid message", async () => {
  await expect(cryptor.decrypt("bogus")).rejects.toThrow(errorInvalidMessage);
});

it("should encrypt text", async () => {
  const message = await cryptor.encrypt("test");
  expect(message).toEqual(expect.stringMatching(regexpEncryptedMessage));
});

describe("while locked", () => {
  it("should report itself as locked", async () => {
    expect(cryptor.isUnlocked()).toBe(false);
  });

  it("should error when unlocking with an incorrect passphrase", async () => {
    await expect(cryptor.unlock("bogus")).rejects.toThrow(errorIncorrectPassphrase);
  });
});

describe("while unlocked", () => {
  beforeEach(async () => {
    expect(await cryptor.unlock(passphrase)).toBe(true);
  });

  it("should report itself as unlocked", async () => {
    expect(cryptor.isUnlocked()).toBe(true);
  });

  it("should unlock with the correct passphrase", async () => {
    await cryptor.unlock(passphrase);
    expect(cryptor.isUnlocked()).toBe(true);
    cryptor.lock();
    expect(cryptor.isUnlocked()).toBe(false);
  });
});
