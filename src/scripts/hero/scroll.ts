export interface ScrollController {
	update(): void;
	destroy(): void;
}

export function createScrollController(
	root: HTMLElement,
	thresholdPx: number,
): ScrollController {
	const update = (): void => {
		root.classList.toggle("is-scrolled", window.scrollY > thresholdPx);
	};

	window.addEventListener("scroll", update, { passive: true });
	update();

	return {
		update,
		destroy: () => window.removeEventListener("scroll", update),
	};
}
