import type { HeroChapterMap } from "../../types/hero";
import { HERO_SWAP_MS } from "./config";
import type { LabelController } from "./labels";
import type { SceneController } from "./scenes";

export interface ChapterElements {
	hero: HTMLElement;
	rises: readonly HTMLElement[];
	blurb: HTMLElement;
	cta: HTMLAnchorElement;
	ctaLabel: HTMLElement;
}

export interface ChapterController {
	readonly current: string;
	show(slug: string): void;
	destroy(): void;
}

export function createChapterController(
	chapters: HeroChapterMap,
	initialSlug: string,
	elements: ChapterElements,
	labels: LabelController,
	scenes: SceneController,
	reducedMotion: boolean,
): ChapterController {
	let current = initialSlug;
	let swapTimer: number | null = null;

	const updateContent = (slug: string): void => {
		const chapter = chapters[slug];
		if (!chapter) return;

		const [firstLine, secondLine] = chapter.headline;
		const firstRise = elements.rises[0];
		const secondRise = elements.rises[1];
		if (firstRise) firstRise.textContent = firstLine;
		if (secondRise) secondRise.textContent = secondLine;

		elements.blurb.replaceChildren();
		chapter.blurb.forEach((line, index) => {
			if (index > 0) elements.blurb.append(document.createElement("br"));
			elements.blurb.append(
				document.createTextNode(index > 0 ? ` ${line}` : line),
			);
		});

		elements.cta.setAttribute("href", chapter.href);
		labels.setText(elements.ctaLabel, chapter.cta);
		void elements.hero.offsetWidth;
	};

	const show = (slug: string): void => {
		if (!chapters[slug] || slug === current) return;
		current = slug;
		scenes.show(slug);
		if (swapTimer !== null) window.clearTimeout(swapTimer);

		const apply = (): void => {
			swapTimer = null;
			updateContent(slug);
			elements.hero.classList.remove("swapping");
		};

		elements.hero.classList.add("swapping");
		if (reducedMotion) apply();
		else swapTimer = window.setTimeout(apply, HERO_SWAP_MS);
	};

	return {
		get current() {
			return current;
		},
		show,
		destroy: () => {
			if (swapTimer !== null) window.clearTimeout(swapTimer);
			swapTimer = null;
		},
	};
}
