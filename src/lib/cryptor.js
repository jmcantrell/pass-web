import {
  readKey,
  readPrivateKey,
  decryptKey,
  readMessage,
  createMessage,
  encrypt as encryptWithPGP,
  decrypt as decryptWithPGP
} from "openpgp";

export default function ({ armoredPublicKey, armoredPrivateKey }) {
  let encryptionKeys, decryptionKeys;

  function isUnlocked() {
    return !!decryptionKeys;
  }

  async function lock() {
    decryptionKeys = null;
  }

  async function unlock(passphrase) {
    const privateKey = await readPrivateKey({ armoredKey: armoredPrivateKey });
    decryptionKeys = await decryptKey({ privateKey, passphrase });
    return isUnlocked();
  }

  async function encrypt(text) {
    if (!encryptionKeys) {
      encryptionKeys = await readKey({ armoredKey: armoredPublicKey });
    }
    const message = await createMessage({ text });
    return await encryptWithPGP({ message, encryptionKeys });
  }

  async function decrypt(armoredMessage) {
    const message = await readMessage({ armoredMessage });
    const { data } = await decryptWithPGP({ message, decryptionKeys });
    return data;
  }

  return { isUnlocked, lock, unlock, encrypt, decrypt };
}
