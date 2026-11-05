import { INTRO_ANIMATION_DURATION_MS } from "./config";

export function initIntroAnimation(root: HTMLElement): () => void {
	const timer = window.setTimeout(() => {
		root.classList.remove("anim");
	}, INTRO_ANIMATION_DURATION_MS);

	return () => window.clearTimeout(timer);
}

initIntroAnimation(document.documentElement);
