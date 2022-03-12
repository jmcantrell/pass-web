export function formToObject(form) {
	const object = {};
	const formData = new FormData(form);

	for (const name of formData.keys()) {
		const input = form.elements[name];
		object[name] = input.multiple ? formData.getAll(name) : formData.get(name);
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
