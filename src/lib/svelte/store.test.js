// @vitest-environment jsdom

import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import { createLocalStorageStore, createSessionStorageStore } from "./store";
import { writable } from "svelte/store";

vi.mock("svelte/store", async () => {
  const module = await vi.importActual("svelte/store");
  return {
    ...module,
    writable: vi.fn((...args) => {
      const { set, ...restStore } = module.writable(...args);
      return { set: vi.fn(set), ...restStore };
    }),
  };
});

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  writable.mockClear();
});

const storeCreators = {
  localStorage: createLocalStorageStore,
  sessionStorage: createSessionStorageStore,
};

for (const [storage, createStore] of Object.entries(storeCreators)) {
  describe(`${storage} store`, () => {
    test("initial value should be passed on to writable", () => {
      const initial = "foo";
      createStore("test", initial);
      expect(writable.calls[0][0]).toBe(initial);
    });

    test("set should reuse original method", () => {
      const expected = "foo";
      const store = createStore("test");
      const { set } = writable.results[0][1];
      store.set(expected);
      expect(set).toHaveBeenLastCalledWith(expected);
    });

    test("update should use set", () => {
      expect.assertions(2);
      const expected = "foo";
      const store = createStore("test");
      const { set } = writable.results[0][1];
      store.update((value) => {
        expect(value).toBeNull();
        return expected;
      });
      expect(set).toHaveBeenLastCalledWith(expected);
    });

    test("subscribe should be used as-is", () => {
      const store = createStore("test");
      const { subscribe } = writable.results[0][1];
      expect(store.subscribe).toBe(subscribe);
    });

    test("setting value should also set in storage", () => {
      const key = "test";
      const expected = "foo";
      const store = createStore(key);
      store.set(expected);
      expect(JSON.parse(window[storage].getItem(key))).toBe(expected);
    });

    test("updating value should also set in storage", () => {
      const key = "test";
      const expected = "foo";
      const store = createStore(key);
      store.update(() => expected);
      expect(JSON.parse(window[storage].getItem(key))).toBe(expected);
    });

    test("storage should not be read from until the first subscriber", () => {
      expect.assertions(1);
      const key = "test";
      const expected = "foo";
      window[storage].setItem(key, JSON.stringify(expected));
      const store = createStore(key); // Initial value is null.
      const unsubscribe = store.subscribe((value) => expect(value).toBe(expected));
      unsubscribe();
    });
  });
}

describe("handling the storage event", () => {
  const key = "test";
  const expected = "foo";

  let spyAdd, spyRemove;

  beforeEach(() => {
    spyAdd = vi.spyOn(window, "addEventListener");
    spyRemove = vi.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    spyAdd.mockRestore();
    spyRemove.mockRestore();
  });

  test("localStorage stores should listen for storage events", () => {
    const store = createLocalStorageStore(key);

    // Listener should be added only after the first subscriber.
    expect(spyAdd).not.toHaveBeenCalled();
    const unsubscribe = store.subscribe(() => {});
    expect(spyAdd).toHaveBeenCalled();
    expect(spyRemove).not.toHaveBeenCalled();

    const { set } = writable.results[0][1];
    set.mockClear(); // Clear the initial call.

    const [eventName, callback] = spyAdd.calls[0];

    // Should have added the event listener for "storage".
    expect(eventName).toBe("storage");

    // When the storage event fires, it will get this value.
    // This call does not fire the event because it's the same tab/window.
    window.localStorage.setItem(key, JSON.stringify(expected));

    const event = new Event("storage");

    // Should not set because the key does not match.
    event.key = `not ${key}`;
    window.dispatchEvent(event);
    expect(set).not.toHaveBeenCalled();

    // Now it should set because the key does match.
    event.key = key;
    window.dispatchEvent(event);
    expect(set).toHaveBeenLastCalledWith(expected);

    // When the last subscriber unsubscribes, the listener should be removed.
    expect(spyRemove).not.toHaveBeenCalled();
    unsubscribe();
    expect(spyRemove).toHaveBeenLastCalledWith("storage", callback);
  });

  test("sessionStorage store should not listen for storage events", () => {
    const store = createSessionStorageStore(key);

    // Listener would normally be added after the first subscriber, but
    // it should not be added at all for sessionStorage.
    expect(spyAdd).not.toHaveBeenCalled();
    const unsubscribe = store.subscribe(() => {});
    expect(spyAdd).not.toHaveBeenCalled();

    const { set } = writable.results[0][1];
    set.mockClear(); // Clear the initial call.

    // If the storage event were to fire, it would use this value.
    // The event should never fire because they are not used in sessionStorage.
    window.sessionStorage.setItem(key, JSON.stringify(expected));

    const event = new Event("storage");

    // It should not matter what the key is.
    event.key = `not ${key}`;
    window.dispatchEvent(event);
    expect(set).not.toHaveBeenCalled();

    // But, just to emphasize...
    event.key = key;
    window.dispatchEvent(event);
    expect(set).not.toHaveBeenCalled();

    // The listener should never have been added.
    expect(spyRemove).not.toHaveBeenCalled();
    unsubscribe();
    expect(spyRemove).not.toHaveBeenCalled();
  });
});
