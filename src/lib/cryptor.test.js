import { test, describe, expect, beforeAll, beforeEach } from "vitest";
import { generateKey } from "openpgp";
import { getBlockRegExp } from "@/schemas/pgp";
import createCryptor from "./cryptor";

let key, cryptor;
const passphrase = "test";
const userIDs = [{ name: "Jane Smith", email: "jane@domain.org" }];

const errorInvalidMessage = "Misformed armored text";
const errorNoKey = "Error decrypting message: No key or password specified";
const errorIncorrectPassphrase = "Error decrypting private key: Incorrect key passphrase";
const encryptedMessageRegExp = getBlockRegExp("message");

beforeAll(async () => {
  key = await generateKey({ userIDs, passphrase });
});

beforeEach(async () => {
  cryptor = await createCryptor(key);
});

test("should refuse to decrypt an invalid message", async () => {
  await expect(cryptor.decrypt("bogus")).rejects.toThrow(errorInvalidMessage);
});

test("should encrypt text", async () => {
  const message = await cryptor.encrypt("test");
  expect(message).toEqual(expect.stringMatching(encryptedMessageRegExp));
});

describe("while locked", () => {
  test("should report itself as locked", async () => {
    expect(cryptor.isUnlocked()).toBe(false);
  });

  test("should error when unlocking with an incorrect passphrase", async () => {
    await expect(cryptor.unlock("bogus")).rejects.toThrow(errorIncorrectPassphrase);
  });

  test("should not decrypt text", async () => {
    const message = await cryptor.encrypt("test");
    await expect(cryptor.decrypt(message)).rejects.toThrow(errorNoKey);
  });
});

describe("while unlocked", () => {
  beforeEach(async () => {
    expect(await cryptor.unlock(passphrase)).toBe(true);
  });

  test("should report itself as unlocked", async () => {
    expect(cryptor.isUnlocked()).toBe(true);
  });

  test("should unlock with the correct passphrase", async () => {
    await cryptor.unlock(passphrase);
    expect(cryptor.isUnlocked()).toBe(true);
    cryptor.lock();
    expect(cryptor.isUnlocked()).toBe(false);
  });

  test("should decrypt text", async () => {
    const expected = "test";
    const message = await cryptor.encrypt(expected);
    expect(await cryptor.decrypt(message)).toBe(expected);
  });
});
