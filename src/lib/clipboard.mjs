// Adapted from: https://github.com/github/clipboard-copy-element

function createNode(text) {
	const node = document.createElement("pre");
	node.style.width = "1px";
	node.style.height = "1px";
	node.style.position = "fixed";
	node.style.top = "5px";
	node.textContent = text;
	return node;
}

function copyNode(node) {
	const selection = getSelection();
	if (selection == null) {
		throw new Error("Unabled to get selection object");
	}
	const range = document.createRange();
	range.selectNodeContents(node);
	selection.addRange(range);
	document.execCommand("copy");
	selection.removeAllRanges();
}

export async function copy(text) {
	if ("clipboard" in navigator) {
		await navigator.clipboard.writeText(text);
		return;
	}

	if (!document.body) {
		return;
	}

	const node = createNode(text);
	document.body.appendChild(node);

	try {
		copyNode(node);
	} finally {
		document.body.removeChild(node);
	}
}
