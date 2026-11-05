import { products } from "../../data/products";
import { buildChapterMap } from "./chapters";
import { createChapterController } from "./chapter-controller";
import {
	LABEL_RESERVE_DEBOUNCE_MS,
	MOBILE_MENU_BREAKPOINT_PX,
	REDUCED_MOTION_QUERY,
	SCROLL_THRESHOLD_PX,
} from "./config";
import { queryElement, queryElements, queryRequired } from "./dom";
import { runIntro } from "./intro";
import { createLabelController } from "./labels";
import { createMenuController } from "./menu";
import { createParallax } from "./parallax";
import { createRailController } from "./rail";
import { createSceneController } from "./scenes";
import { createScrollController } from "./scroll";

export function initHero(): () => void {
	const stage = queryElement<HTMLElement>(".stage");
	const firstProduct = products[0];
	if (!stage || !firstProduct) return () => {};

	const cleanups: Array<() => void> = [];

	const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
	const labels = createLabelController(stage, reducedMotion);
	const hero = queryRequired<HTMLElement>(".hero", stage);
	const cta = queryRequired<HTMLAnchorElement>(".cta", hero);
	const scenes = createSceneController(
		queryElements<HTMLVideoElement>(".bg video", stage),
	);
	const chapterController = createChapterController(
		buildChapterMap(products),
		firstProduct.slug,
		{
			hero,
			rises: queryElements<HTMLElement>(".hrise", hero),
			blurb: queryRequired<HTMLElement>(".blurb", hero),
			cta,
			ctaLabel: queryRequired<HTMLElement>(".t", cta),
		},
		labels,
		scenes,
		reducedMotion,
	);

	const railController = createRailController(
		queryRequired<HTMLElement>(".index", stage),
		labels,
		(slug) => chapterController.show(slug),
	);
	const menuController = createMenuController({
		root: document.documentElement,
		menu: queryRequired<HTMLButtonElement>(".menu", stage),
		navset: queryRequired<HTMLElement>("#navset", stage),
		labels,
		breakpointPx: MOBILE_MENU_BREAKPOINT_PX,
	});
	const scrollController = createScrollController(
		document.documentElement,
		SCROLL_THRESHOLD_PX,
	);
	const parallax = createParallax(
		queryElement<HTMLElement>(".bg", stage),
		reducedMotion,
	);
	const unbindHover = labels.bindHover(stage);

	cleanups.push(
		() => railController.destroy(),
		() => menuController.destroy(),
		() => scrollController.destroy(),
		() => parallax.destroy(),
		() => chapterController.destroy(),
		() => scenes.destroy(),
		unbindHover,
	);

	let resizeTimer: number | null = null;
	const onResize = (): void => {
		if (resizeTimer !== null) window.clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(() => {
			resizeTimer = null;
			labels.reserve();
		}, LABEL_RESERVE_DEBOUNCE_MS);
	};
	window.addEventListener("resize", onResize);

	let destroyed = false;
	let stopIntro: (() => void) | null = null;
	const boot = (): void => {
		if (destroyed) return;
		stopIntro = runIntro(labels, reducedMotion);
	};
	if (document.fonts?.ready) void document.fonts.ready.then(boot);
	else window.addEventListener("load", boot, { once: true });

	return () => {
		destroyed = true;
		if (resizeTimer !== null) window.clearTimeout(resizeTimer);
		resizeTimer = null;
		window.removeEventListener("resize", onResize);
		stopIntro?.();
		for (const cleanup of cleanups) cleanup();
	};
}

initHero();
