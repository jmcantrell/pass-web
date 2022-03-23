import { writable } from "svelte/store";

const noop = () => {};

export function ensureSubscriber(store, callback = noop) {
  store.subscribe(callback);
  return store;
}

function createWebStorageStore(area, key, listen, { initial = null, validate = null }) {
  let current = initial;
  const storage = window[`${area}Storage`];

  const { set: setInner, ...store } = writable(initial, () => {
    setFromStorageOrInitial();
    if (listen) {
      const updateFromStorageEvents = (event) => {
        if (event.key === key) setFromStorageOrInitial();
      };
      window.addEventListener("storage", updateFromStorageEvents);
      return () => {
        window.removeEventListener("storage", updateFromStorageEvents);
      };
    }
  });

  function setStore(value) {
    setInner(validate ? validate(value) : value);
  }

  function set(value) {
    current = value;
    setStore(value);
    storage.setItem(key, JSON.stringify(value));
    console.debug(`saved ${key} to ${area} storage`);
  }

  function update(callback) {
    set(callback(current));
  }

  function setFromStorageOrInitial() {
    const value = JSON.parse(storage.getItem(key));
    if (value === null) {
      set(initial);
    } else {
      setStore(value);
      current = value;
    }
  }

  function remove() {
    storage.removeItem(key);
  }

  return { ...store, set, update, remove };
}

export function createLocalStorageStore(key, options = {}) {
  return createWebStorageStore("local", key, true, options);
}

export function createSessionStorageStore(key, options = {}) {
  return createWebStorageStore("session", key, false, options);
}
