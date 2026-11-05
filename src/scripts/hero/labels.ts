import {
	HOVER_TARGET_SELECTOR,
	LABEL_SELECTOR,
	SCRAMBLE_CHARS,
	SCRAMBLE_DURATION_MS,
	SCRAMBLE_ROLL_INTERVAL_MS,
	SCRAMBLE_TAIL_LENGTH,
} from "./config";
import { queryElements } from "./dom";

interface LabelState {
	text: string;
	frame: number | null;
	timeout: number | null;
}

export interface LabelController {
	readonly labels: readonly HTMLElement[];
	reserve(): void;
	settle(element: HTMLElement): void;
	settleAll(): void;
	decode(element: HTMLElement, duration?: number): void;
	setText(element: HTMLElement, text: string): void;
	bindHover(root: ParentNode): () => void;
}

export function createLabelController(
	root: ParentNode,
	reducedMotion: boolean,
): LabelController {
	const labels = queryElements<HTMLElement>(LABEL_SELECTOR, root);
	const states = new WeakMap<HTMLElement, LabelState>();

	for (const label of labels) {
		states.set(label, {
			text: label.textContent ?? "",
			frame: null,
			timeout: null,
		});
	}

	const stateOf = (element: HTMLElement): LabelState => {
		const state = states.get(element);
		if (!state) throw new Error("Label is not managed by this controller");
		return state;
	};

	const settle = (element: HTMLElement): void => {
		const state = stateOf(element);
		if (state.frame !== null) cancelAnimationFrame(state.frame);
		if (state.timeout !== null) window.clearTimeout(state.timeout);
		state.frame = null;
		state.timeout = null;
		element.textContent = state.text;
	};

	const decode = (element: HTMLElement, duration = SCRAMBLE_DURATION_MS): void => {
		const state = stateOf(element);
		const text = state.text;
		const length = text.length;
		settle(element);
		if (reducedMotion || length === 0) return;

		const randomChars = new Array<string>(length);
		const roll = (): void => {
			for (let index = 0; index < length; index++) {
				randomChars[index] = SCRAMBLE_CHARS.charAt(
					(Math.random() * SCRAMBLE_CHARS.length) | 0,
				);
			}
		};

		let lastRoll = 0;
		const start = performance.now();
		roll();

		const step = (now: number): void => {
			const progress = Math.min(1, (now - start) / duration);
			const front = progress * length;
			if (now - lastRoll > SCRAMBLE_ROLL_INTERVAL_MS) {
				roll();
				lastRoll = now;
			}

			let output = "";
			for (let index = 0; index < length; index++) {
				const char = text.charAt(index);
				if (index < front) output += char;
				else if (index < front + SCRAMBLE_TAIL_LENGTH) {
					output += char === " " ? " " : randomChars[index] ?? "";
				} else break;
			}

			element.textContent = output;
			if (progress < 1) state.frame = requestAnimationFrame(step);
			else settle(element);
		};

		state.frame = requestAnimationFrame(step);
		state.timeout = window.setTimeout(() => settle(element), duration + 500);
	};

	const setText = (element: HTMLElement, text: string): void => {
		const state = stateOf(element);
		state.text = text;
		element.style.width = "";
		element.textContent = text;
		const width = element.getBoundingClientRect().width;
		element.style.width = `${Math.ceil(width * 100) / 100}px`;
		decode(element);
	};

	const reserve = (): void => {
		for (const label of labels) label.style.width = "";
		const widths = labels.map((label) => label.getBoundingClientRect().width);
		labels.forEach((label, index) => {
			label.style.width = `${Math.ceil((widths[index] ?? 0) * 100) / 100}px`;
		});
	};

	const bindHover = (hoverRoot: ParentNode): (() => void) => {
		const removers: Array<() => void> = [];
		for (const target of queryElements<HTMLElement>(HOVER_TARGET_SELECTOR, hoverRoot)) {
			const label = target.querySelector<HTMLElement>(LABEL_SELECTOR);
			if (!label) continue;
			const onPointerEnter = (): void => decode(label);
			target.addEventListener("pointerenter", onPointerEnter);
			removers.push(() => target.removeEventListener("pointerenter", onPointerEnter));
		}
		return () => {
			for (const remove of removers) remove();
		};
	};

	return {
		labels,
		reserve,
		settle,
		settleAll: () => {
			for (const label of labels) settle(label);
		},
		decode,
		setText,
		bindHover,
	};
}
