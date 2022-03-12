export const characterClasses = {
	digit: {
		name: "numeric digits",
		value: "0123456789"
	},
	lower: {
		name: "lower-case letters",
		value: "abcdefghijklmnopqrstuvwxyz"
	},
	upper: {
		name: "upper-case letters",
		value: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	},
	punct: {
		name: "punctuation characters",
		value: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~'"
	}
};

export function generate(length, classes = null) {
	const pool = (classes || Object.keys(characterClasses))
		.map((type) => characterClasses[type].value)
		.join("");

	const result = Array(length);

	for (let i = 0; i < length; i++) {
		result[i] = pool[Math.floor(Math.random() * pool.length)];
	}

	return result.join("");
}
