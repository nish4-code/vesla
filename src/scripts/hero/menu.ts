import { LABEL_SELECTOR, MENU_FOCUS_DELAY_MS } from "./config";
import { queryRequired } from "./dom";
import type { LabelController } from "./labels";

interface MenuOptions {
	root: HTMLElement;
	menu: HTMLButtonElement;
	navset: HTMLElement;
	labels: LabelController;
	breakpointPx: number;
}

export interface MenuController {
	close(): void;
	destroy(): void;
}

export function createMenuController({
	root,
	menu,
	navset,
	labels,
	breakpointPx,
}: MenuOptions): MenuController {
	const menuLabel = queryRequired<HTMLElement>(LABEL_SELECTOR, menu);
	let focusTimer: number | null = null;

	const isOpen = (): boolean => root.classList.contains("nav-open");

	const setOpen = (open: boolean): void => {
		root.classList.toggle("nav-open", open);
		menu.setAttribute("aria-expanded", String(open));
		labels.setText(menuLabel, open ? "CERRAR" : "MENÚ");

		if (!open) return;
		if (focusTimer !== null) window.clearTimeout(focusTimer);
		focusTimer = window.setTimeout(() => {
			focusTimer = null;
			navset.querySelector<HTMLAnchorElement>("a")?.focus();
		}, MENU_FOCUS_DELAY_MS);
	};

	const onMenuClick = (event: MouseEvent): void => {
		event.stopPropagation();
		setOpen(!isOpen());
	};

	const onNavsetClick = (event: MouseEvent): void => {
		const target = event.target;
		if (target instanceof Element && target.closest("a")) setOpen(false);
	};

	const onKeyDown = (event: KeyboardEvent): void => {
		if (event.key !== "Escape" || !isOpen()) return;
		setOpen(false);
		menu.focus();
	};

	const onDocumentClick = (event: MouseEvent): void => {
		if (!isOpen()) return;
		const target = event.target;
		if (!(target instanceof Node)) return;
		if (!navset.contains(target) && target !== menu) setOpen(false);
	};

	const onResize = (): void => {
		if (window.innerWidth > breakpointPx && isOpen()) setOpen(false);
	};

	menu.addEventListener("click", onMenuClick);
	navset.addEventListener("click", onNavsetClick);
	document.addEventListener("keydown", onKeyDown);
	document.addEventListener("click", onDocumentClick);
	window.addEventListener("resize", onResize);

	return {
		close: () => setOpen(false),
		destroy: () => {
			menu.removeEventListener("click", onMenuClick);
			navset.removeEventListener("click", onNavsetClick);
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("click", onDocumentClick);
			window.removeEventListener("resize", onResize);
			if (focusTimer !== null) window.clearTimeout(focusTimer);
			focusTimer = null;
		},
	};
}
