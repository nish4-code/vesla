import { INTRO_SCHEDULE, INTRO_SETTLE_DELAY_MS } from "./config";
import { queryElements } from "./dom";
import type { LabelController } from "./labels";

export function runIntro(
	labels: LabelController,
	reducedMotion: boolean,
): () => void {
	labels.reserve();
	if (reducedMotion) return () => {};

	const timers: number[] = [];
	for (const intro of INTRO_SCHEDULE) {
		const targets = queryElements<HTMLElement>(intro.selector);
		targets.forEach((target, index) => {
			const delay = intro.delay + index * (intro.step ?? 0);
			timers.push(window.setTimeout(() => labels.decode(target), delay));
		});
	}

	timers.push(
		window.setTimeout(() => labels.settleAll(), INTRO_SETTLE_DELAY_MS),
	);

	return () => {
		for (const timer of timers) window.clearTimeout(timer);
	};
}
