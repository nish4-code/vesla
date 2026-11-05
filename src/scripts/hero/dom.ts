export function queryElement<T extends Element>(
	selector: string,
	parent: ParentNode = document,
): T | null {
	return parent.querySelector<T>(selector);
}

export function queryElements<T extends Element>(
	selector: string,
	parent: ParentNode = document,
): T[] {
	return Array.from(parent.querySelectorAll<T>(selector));
}

export function queryRequired<T extends Element>(
	selector: string,
	parent: ParentNode = document,
): T {
	const element = queryElement<T>(selector, parent);
	if (!element) throw new Error(`Missing required element: ${selector}`);
	return element;
}
