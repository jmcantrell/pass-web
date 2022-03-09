export class FetchError extends Error {
	constructor(response) {
		super(`${response.status} ${response.statusText}`);
		this.name = "FetchError";
		this.response = response;
	}
}
