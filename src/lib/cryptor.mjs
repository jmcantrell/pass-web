import * as pgp from "openpgp";

export default function ({ armoredPublicKey, armoredPrivateKey }) {
	let encryptionKeys, decryptionKeys;

	function isUnlocked() {
		return !!decryptionKeys;
	}

	async function lock() {
		decryptionKeys = null;
	}

	async function unlock(passphrase) {
		const privateKey = await pgp.readPrivateKey({ armoredKey: armoredPrivateKey });
		decryptionKeys = await pgp.decryptKey({ privateKey, passphrase });
	}

	async function encrypt(text) {
		if (!encryptionKeys) {
			encryptionKeys = await pgp.readKey({ armoredKey: armoredPublicKey });
		}
		const message = await pgp.createMessage({ text });
		return await pgp.encrypt({ message, encryptionKeys });
	}

	async function decrypt(armoredMessage) {
		const message = await pgp.readMessage({ armoredMessage });
		const { data } = await pgp.decrypt({ message, decryptionKeys });
		return data;
	}

	return {
		isUnlocked,
		lock,
		unlock,
		encrypt,
		decrypt
	};
}
