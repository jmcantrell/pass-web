export function convertFormToObject(form) {
  const object = {};
  const formData = new FormData(form);
  const names = new Set(formData.keys());

  for (const name of names) {
    const input = form.elements[name];
    const multiple = input instanceof RadioNodeList || input.multiple;
    object[name] = multiple ? formData.getAll(name) : formData.get(name);
  }

  return object;
}
