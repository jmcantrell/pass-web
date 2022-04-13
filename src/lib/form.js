export function convertFormToObject(form) {
  const object = {};
  const formData = new FormData(form);
  const names = new Set(formData.keys());

  for (const name of names) {
    object[name] = form.elements[name].multiple ? formData.getAll(name) : formData.get(name);
  }

  return object;
}
