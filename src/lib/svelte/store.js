import { writable } from "svelte/store";

function createWebStorageStore(area, key, listen, initial = null) {
  let current = initial;
  const storage = `${area}Storage`;

  const { set: setInner, subscribe } = writable(initial, () => {
    const setFromStorageOrInitial = () => {
      const value = JSON.parse(window[storage].getItem(key));
      setStore(value === null ? initial : value);
    };

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
    current = value;
    setInner(value);
  }

  function set(value) {
    setStore(value);
    window[storage].setItem(key, JSON.stringify(value));
  }

  function update(callback) {
    set(callback(current));
  }

  return { subscribe, set, update };
}

export function createLocalStorageStore(key, initial = null) {
  return createWebStorageStore("local", key, true, initial);
}

export function createSessionStorageStore(key, initial = null) {
  return createWebStorageStore("session", key, false, initial);
}
