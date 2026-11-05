import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ProcessElements {
	track: HTMLElement;
	line: HTMLElement;
}

function getProcessElements(): ProcessElements | null {
	const root = document.querySelector<HTMLElement>("[data-process]");

	if (!root) {
		return null;
	}

	const track = root.querySelector<HTMLElement>("[data-process-track]");
	const line = root.querySelector<HTMLElement>("[data-process-line]");

	if (!track || !line) {
		return null;
	}

	return { track, line };
}

export function initProcess(): () => void {
	const elements = getProcessElements();

	if (!elements) {
		return () => {};
	}

	const { track, line } = elements;
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (reducedMotion) {
		gsap.set(line, { scaleY: 1 });
		return () => {};
	}

	const tween = gsap.fromTo(
		line,
		{ scaleY: 0 },
		{
			scaleY: 1,
			ease: "none",
			scrollTrigger: {
				trigger: track,
				start: "top 78%",
				end: "bottom 66%",
				scrub: 0.5,
			},
		},
	);

	return () => {
		tween.scrollTrigger?.kill();
		tween.kill();
	};
}

initProcess();
