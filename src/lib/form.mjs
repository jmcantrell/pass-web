export function formToObject(form) {
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

export function setValidity(form, name, message) {
	const input = form.elements[name];
	input.setCustomValidity(message);
	input.reportValidity();
}

export function clearValidity(event) {
	event.target.setCustomValidity("");
}
