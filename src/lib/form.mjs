export function formToObject(form) {
	const object = {};
	const formData = new FormData(form);

	for (const name of formData.keys()) {
		const input = form.elements[name];
		object[name] = input.multiple ? formData.getAll(name) : formData.get(name);
	}

	return object;
}
