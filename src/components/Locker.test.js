// @vitest-environment jsdom

import { vi, test, expect, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/svelte";
import Locker from "./Locker";

vi.mock("@/local/stores", () => {
  return {
    default: {
      subscribe: (callback) => {
        onStoresUpdate = () => callback(stores);
        onStoresUpdate();
        return () => {};
      },
    },
  };
});

vi.mock("@/local/options", () => {
  return {
    default: {
      subscribe: (callback) => {
        onOptionsUpdate = () => callback(options);
        onOptionsUpdate();
        return () => {};
      },
    },
  };
});

function setEnabled(state, seconds) {
  options.locker.enabled = state;
  options.locker.timeout = seconds;
  onOptionsUpdate();
}

function setHidden(state) {
  hidden = state;
  document.dispatchEvent(new Event("visibilitychange"));
}

Object.defineProperty(document, "hidden", {
  configurable: true,
  get: function () {
    return hidden;
  },
});

let rendering;
let hidden = false;
let stores, onStoresUpdate;
let options, onOptionsUpdate;

beforeEach(() => {
  stores = {
    foo: { lock: vi.fn() },
    bar: { lock: vi.fn() },
  };
  options = { locker: {} };
  hidden = false;
  rendering = render(Locker);
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  rendering.unmount();
});

test("should lock all stores after a timeout, if enabled", () => {
  const seconds = 10;

  setEnabled(true, seconds);
  setHidden(true);

  vi.advanceTimersByTime((seconds - 1) * 1000);
  for (const store of Object.values(stores)) {
    expect(store.lock).not.toHaveBeenCalled();
  }

  vi.advanceTimersByTime(1000);
  for (const store of Object.values(stores)) {
    expect(store.lock).toHaveBeenCalled();
  }
});

test("should abort lock timeout if disabled later", () => {
  const seconds = 10;

  setEnabled(true, seconds);
  setHidden(true);

  vi.advanceTimersByTime((seconds - 1) * 1000);
  for (const store of Object.values(stores)) {
    expect(store.lock).not.toHaveBeenCalled();
  }

  setEnabled(false);

  vi.advanceTimersByTime(1000);
  for (const store of Object.values(stores)) {
    expect(store.lock).not.toHaveBeenCalled();
  }
});

test("should abort lock timeout if document becomes visible before", () => {
  const seconds = 10;

  setEnabled(true, seconds);
  setHidden(true);

  vi.advanceTimersByTime((seconds - 1) * 1000);
  for (const store of Object.values(stores)) {
    expect(store.lock).not.toHaveBeenCalled();
  }

  setHidden(false);

  vi.advanceTimersByTime(1000);
  for (const store of Object.values(stores)) {
    expect(store.lock).not.toHaveBeenCalled();
  }
});

test("should immediately lock if document becomes hidden and timeout is zero", () => {
  setEnabled(true, 0);

  for (const store of Object.values(stores)) {
    expect(store.lock).not.toHaveBeenCalled();
  }

  setHidden(true);

  for (const store of Object.values(stores)) {
    expect(store.lock).toHaveBeenCalled();
  }
});
