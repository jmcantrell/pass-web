// @vitest-environment jsdom

import { describe, test, expect } from "vitest";
import { convertFormToObject } from "./form";

function createElement(name, attributes = {}) {
  const element = document.createElement(name);
  for (const [key, value] of Object.entries(attributes)) {
    element[key] = value;
  }
  return element;
}

describe("converting a form to a plain object", () => {
  test("result should have named inputs with values", () => {
    const form = createElement("form");
    form.appendChild(createElement("input", { name: "foo", value: "a" }));
    form.appendChild(createElement("input", { name: "bar", value: "b" }));
    form.appendChild(createElement("input", { value: "c" })); // Should omit unnamed inputs.
    expect(convertFormToObject(form)).toEqual({ foo: "a", bar: "b" });
  });

  test("inputs with the multiple attribute should be collected into arrays", () => {
    const form = createElement("form");
    form.appendChild(createElement("input", { name: "foo", value: "a", multiple: true }));
    form.appendChild(createElement("input", { name: "foo", value: "b", multiple: true }));
    form.appendChild(createElement("input", { name: "bar", value: "c", multiple: true }));
    form.appendChild(createElement("input", { name: "bar", value: "d", multiple: true }));
    expect(convertFormToObject(form)).toEqual({ foo: ["a", "b"], bar: ["c", "d"] });
  });
});
