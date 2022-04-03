export function convertObjectToSearchParams(object = {}) {
  const search = new URLSearchParams();
  for (const [key, values] of Object.entries(object)) {
    if (Array.isArray(values)) {
      for (const value of values) {
        search.append(key, value);
      }
    } else {
      search.append(key, values);
    }
  }
  return search;
}

export function convertSearchParamsToObject(search) {
  const object = {};
  for (const key of search.keys()) {
    const values = search.getAll(key);
    object[key] = values.length == 1 ? values[0] : values;
  }
  return object;
}
