export function objectFromForm(form) {
	return Object.fromEntries(new FormData(form).entries());
}
