import { LABEL_SELECTOR, RAIL_AUTOPLAY_INTERVAL_MS } from "./config";
import { queryElements } from "./dom";
import type { LabelController } from "./labels";

export interface RailController {
	destroy(): void;
}

export function createRailController(
	rail: HTMLElement,
	labels: LabelController,
	onSelect: (slug: string) => void,
): RailController {
	const links = queryElements<HTMLAnchorElement>("a", rail);
	const items = queryElements<HTMLLIElement>("li", rail);
	const removers: Array<() => void> = [];
	let currentIndex = Math.max(
		0,
		items.findIndex((item) => item.classList.contains("on")),
	);
	let timer: number | null = null;
	let hovering = false;
	let focused = false;

	function stopAuto(): void {
		if (timer === null) return;
		window.clearInterval(timer);
		timer = null;
	}

	function shouldAuto(): boolean {
		return !hovering && !focused && !document.hidden && links.length > 1;
	}

	function startAuto(): void {
		stopAuto();
		if (!shouldAuto()) return;
		timer = window.setInterval(() => {
			if (!shouldAuto()) return;
			const next = (currentIndex + 1) % links.length;
			const link = links[next];
			if (link) select(link, next);
		}, RAIL_AUTOPLAY_INTERVAL_MS);
	}

	function syncAuto(): void {
		if (shouldAuto()) startAuto();
		else stopAuto();
	}

	function select(link: HTMLAnchorElement, index: number): void {
		for (const item of items) item.classList.remove("on");
		for (const other of links) other.removeAttribute("aria-current");
		items[index]?.classList.add("on");
		link.setAttribute("aria-current", "true");

		const label = link.querySelector<HTMLElement>(LABEL_SELECTOR);
		if (label) labels.decode(label);

		const slug = link.hash.slice(1);
		if (slug) onSelect(slug);

		currentIndex = index;
		startAuto();
	}

	for (const [index, link] of links.entries()) {
		const onClick = (event: Event): void => {
			event.preventDefault();
			select(link, index);
		};

		link.addEventListener("click", onClick);
		removers.push(() => link.removeEventListener("click", onClick));
	}

	const onPointerEnter = (event: PointerEvent): void => {
		if (event.pointerType === "touch") return;
		hovering = true;
		syncAuto();
	};

	const onPointerLeave = (event: PointerEvent): void => {
		if (event.pointerType === "touch") return;
		hovering = false;
		syncAuto();
	};

	const onFocusIn = (): void => {
		const active = document.activeElement;
		if (!(active instanceof HTMLElement) || !active.matches(":focus-visible")) return;
		focused = true;
		syncAuto();
	};

	const onFocusOut = (event: FocusEvent): void => {
		const next = event.relatedTarget;
		if (next instanceof Node && rail.contains(next)) return;
		focused = false;
		syncAuto();
	};

	const onVisibilityChange = (): void => syncAuto();

	rail.addEventListener("pointerenter", onPointerEnter);
	rail.addEventListener("pointerleave", onPointerLeave);
	rail.addEventListener("focusin", onFocusIn);
	rail.addEventListener("focusout", onFocusOut);
	document.addEventListener("visibilitychange", onVisibilityChange);
	removers.push(
		() => rail.removeEventListener("pointerenter", onPointerEnter),
		() => rail.removeEventListener("pointerleave", onPointerLeave),
		() => rail.removeEventListener("focusin", onFocusIn),
		() => rail.removeEventListener("focusout", onFocusOut),
		() => document.removeEventListener("visibilitychange", onVisibilityChange),
	);

	startAuto();

	return {
		destroy: () => {
			stopAuto();
			for (const remove of removers) remove();
		},
	};
}
