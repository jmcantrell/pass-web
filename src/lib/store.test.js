import { vi, describe, test, expect, beforeAll, beforeEach, afterEach } from "vitest";
import { generateKey } from "openpgp";
import { getBlockRegExp } from "@/schemas/pgp";
import createCryptor from "@/lib/cryptor";
import createStore from "./store";

function createMockProvider(files) {
  return {
    has: vi.fn((path) => !!files[path]),
    set: vi.fn((file, content) => {
      files[file] = content;
    }),
    get: vi.fn((path) => {
      if (!files[path]) throw new Error();
      return files[path];
    }),
    list: vi.fn(() => Object.keys(files)),
    remove: vi.fn((path) => {
      if (!files[path]) throw new Error();
      delete files[path];
    }),
    duplicate: vi.fn((from, to) => {
      if (!files[from]) throw new Error();
      files[to] = files[from];
    }),
    rename: vi.fn((from, to) => {
      if (!files[from]) throw new Error();
      files[to] = files[from];
      delete files[from];
    }),
  };
}

let files, store, provider, cryptor;

const password = "password";
const extra = "extra";
const paths = ["ignored.txt", "stuff.gpg", "site/username.gpg"];
const encryptedMessageRegExp = getBlockRegExp("message");

beforeAll(async () => {
  const passphrase = "test";
  const userIDs = [{ name: "Jane Smith", email: "jane@domain.org" }];
  cryptor = await createCryptor(await generateKey({ userIDs, passphrase }));
  await cryptor.unlock(passphrase);
});

beforeEach(async () => {
  const content = await cryptor.encrypt(`${password}\n${extra}`);
  files = Object.fromEntries(paths.map((path) => [path, content]));
  provider = createMockProvider(files);
  store = createStore({ provider, cryptor });
  for (const method of Object.values(provider)) {
    method.mockClear();
  }
});

describe("list", () => {
  afterEach(() => {
    expect(provider.list).toHaveBeenCalled();
  });

  test("should only include gpg files and strip extensions", async () => {
    expect(await store.list()).toEqual(["stuff", "site/username"]);
  });
});

describe("has", () => {
  test("should not affirm presence of non-gpg files", async () => {
    expect(await store.has("ignored")).toBe(false);
    expect(provider.has).toHaveBeenCalledWith("ignored.gpg");
  });

  test("should affirm the presence of gpg files", async () => {
    for (const name of ["stuff", "site/username"]) {
      expect(await store.has(name)).toBe(true);
      expect(provider.has).toHaveBeenCalledWith(`${name}.gpg`);
    }
  });
});

describe("get", () => {
  test("should return decrypted content for existing entry", async () => {
    for (const name of ["stuff", "site/username"]) {
      expect(await store.get(name)).toEqual({ password, extra });
      expect(provider.get).toHaveBeenCalledWith(`${name}.gpg`);
    }
  });

  test("should throw an error for missing entry", async () => {
    await expect(store.get("ignored")).rejects.toThrow();
    expect(provider.get).toHaveBeenCalledWith("ignored.gpg");
  });
});

describe("set", () => {
  test("should accept empty values", async () => {
    await store.set("new", {});
    expect(await cryptor.decrypt(files["new.gpg"])).toBe("");
  });

  test("should add encrypted entry", async () => {
    await store.set("new", { password, extra });
    expect(await cryptor.decrypt(files["new.gpg"])).toBe(`${password}\n${extra}`);
    expect(provider.set.calls[0][0]).toBe("new.gpg");
    expect(provider.set.calls[0][2]).toBe("Add password for new using web interface.");
  });

  test("should overwrite existing entry", async () => {
    const password = "password2";
    const extra = "extra2";
    await store.set("stuff", { password, extra });
    expect(await cryptor.decrypt(files["stuff.gpg"])).toBe(`${password}\n${extra}`);
    expect(provider.set.calls[0][0]).toBe("stuff.gpg");
    expect(provider.set.calls[0][2]).toBe("Edit password for stuff using web interface.");
  });
});

describe("remove", () => {
  test("should remove entry", async () => {
    await store.remove("stuff");
    expect(files["stuff.gpg"]).toBeUndefined();
    expect(provider.remove).toHaveBeenCalledWith(
      "stuff.gpg",
      "Remove password for stuff using web interface."
    );
  });

  test("should throw an error for missing entry", async () => {
    await expect(store.remove("ignored")).rejects.toThrow();
    expect(provider.remove).toHaveBeenCalledWith(
      "ignored.gpg",
      "Remove password for ignored using web interface."
    );
  });
});

describe("duplicate", () => {
  test("should copy entry", async () => {
    await store.duplicate("stuff", "stuff2");
    expect(files["stuff.gpg"]).toMatch(encryptedMessageRegExp);
    expect(files["stuff.gpg"]).toBe(files["stuff2.gpg"]);
    expect(provider.duplicate).toHaveBeenCalledWith(
      "stuff.gpg",
      "stuff2.gpg",
      "Copy stuff to stuff2 using web interface."
    );
  });

  test("should throw an error if origin is missing", async () => {
    await expect(store.duplicate("ignored", "ignored2")).rejects.toThrow();
    expect(provider.duplicate).toHaveBeenCalledWith(
      "ignored.gpg",
      "ignored2.gpg",
      "Copy ignored to ignored2 using web interface."
    );
  });
});

describe("rename", () => {
  test("should move entry", async () => {
    const content = files["stuff.gpg"];
    expect(content).toMatch(encryptedMessageRegExp);
    await store.rename("stuff", "crap");
    expect(files["stuff.gpg"]).toBeUndefined();
    expect(files["crap.gpg"]).toBe(content);
    expect(provider.rename).toHaveBeenCalledWith(
      "stuff.gpg",
      "crap.gpg",
      "Rename stuff to crap using web interface."
    );
  });

  test("should throw an error if origin is missing", async () => {
    await expect(store.rename("ignored", "ignored2")).rejects.toThrow();
    expect(provider.rename).toHaveBeenCalledWith(
      "ignored.gpg",
      "ignored2.gpg",
      "Rename ignored to ignored2 using web interface."
    );
  });
});
