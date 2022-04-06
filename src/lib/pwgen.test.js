import { test, expect } from "vitest";
import { default as pwgen, classes } from "./pwgen";
import crypto from "crypto";

function subsets(set) {
  const n = set.length;
  const result = [];

  for (let mask = 0; mask < 1 << n; mask++) {
    const selection = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        selection.push(set[i]);
      }
    }
    result.push(selection);
  }

  return result;
}

global.crypto = crypto;

function getClassCharacters(keys = Object.keys(classes)) {
  return keys.map((key) => classes[key].value).join("");
}

function expectToBeSubset(items, pool) {
  for (const item of items) {
    expect(pool).toContain(item);
  }
}

test("generates empty string by default", () => {
  expect(pwgen()).toBe("");
});

test("generates using all classes by default", () => {
  const password = pwgen(100);
  expectToBeSubset(password, getClassCharacters());
});

test("generates passwords of the requested length", () => {
  for (let length = 0; length < 100; length++) {
    const password = pwgen(length);
    expect(password.length).toBe(length);
  }
});

for (const classKeys of subsets(Object.keys(classes))) {
  if (classKeys.length == 0) {
    test("generates empty passwords if no classes are given, regardless of length", () => {
      expect(pwgen(100, classKeys).length).toBe(0);
    });
  } else {
    const desc = classKeys.join(", ");
    test(`generates passwords with: ${desc}`, () => {
      const length = 100;
      const password = pwgen(length, classKeys);
      expect(password.length).toBe(length);
      expectToBeSubset(password, getClassCharacters(classKeys));
    });
  }
}
