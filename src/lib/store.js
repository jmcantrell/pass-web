const newline = "\n";
const extension = ".gpg";

function serialize(entry) {
  const password = entry.password || "";
  const extra = entry.extra || "";
  return password + newline + extra;
}

function deserialize(text) {
  const lines = text.split(newline);
  const password = lines[0] || "";
  const extra = lines.slice(1).join(newline);
  return { password, extra };
}

export default function ({ provider, cryptor }) {
  async function list() {
    return (await provider.list())
      .filter((path) => path.endsWith(extension))
      .map((path) => path.slice(0, -extension.length));
  }

  async function has(name) {
    return await provider.has(name + extension);
  }

  async function get(name) {
    const armoredMessage = await provider.get(name + extension);
    const content = await cryptor.decrypt(armoredMessage);
    return deserialize(content);
  }

  async function set(name, entry) {
    const update = await has(name);
    const content = serialize(entry);
    const armoredMessage = await cryptor.encrypt(content);
    const commitMessage = `${update ? "Edit" : "Add"} password for ${name} using web interface.`;
    await provider.set(name + extension, armoredMessage, commitMessage, update);
  }

  async function remove(name) {
    await provider.remove(name + extension, `Remove password for ${name} using web interface.`);
  }

  async function updated(name) {
    return await provider.updated(name + extension);
  }

  return { list, has, get, set, remove, updated };
}
