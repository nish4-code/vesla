import gsap from "gsap";

const pad = (value: number) => String(value).padStart(2, "0");

export function initProductStory(): () => void {
	const root = document.querySelector<HTMLElement>("[data-product-story]");

	if (!root) {
		return () => {};
	}

	const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-story-panel]"));
	const steps = Array.from(root.querySelectorAll<HTMLElement>("[data-story-step]"));
	const videos = Array.from(root.querySelectorAll<HTMLVideoElement>("[data-story-video]"));
	const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-story-go]"));
	const counter = root.querySelector<HTMLElement>("[data-story-counter]");
	const number = root.querySelector<HTMLElement>("[data-story-number]");
	const progress = root.querySelector<HTMLElement>("[data-story-progress]");

	if (panels.length === 0 || steps.length !== panels.length) {
		return () => {};
	}

	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	let activeIndex = -1;
	let panelTimeline: gsap.core.Timeline | null = null;
	let scrollFrame: number | null = null;
	let resizeTimer: number | null = null;

	const playActiveVideo = (index: number): void => {
		videos.forEach((video, videoIndex) => {
			if (videoIndex !== index && !video.paused) {
				video.pause();
			}
		});

		const video = videos[index];

		if (!video) {
			return;
		}

		const source = video.dataset.src;

		if (source && !video.getAttribute("src")) {
			video.src = source;
			video.load();
		}

		void video.play().catch(() => {});
	};

	const setActive = (index: number, animate: boolean): void => {
		if (index < 0 || index >= panels.length || index === activeIndex) {
			return;
		}

		activeIndex = index;

		panels.forEach((panel, panelIndex) => {
			const isActive = panelIndex === index;
			panel.toggleAttribute("inert", !isActive);
			panel.setAttribute("aria-hidden", String(!isActive));
		});

		buttons.forEach((button, buttonIndex) => {
			button.dataset.active = String(buttonIndex === index);
		});

		videos.forEach((video, videoIndex) => {
			const isActive = videoIndex === index;
			video.classList.toggle("opacity-100", isActive);
			video.classList.toggle("opacity-0", !isActive);
		});

		if (counter) {
			counter.textContent = pad(index + 1);
		}

		if (number) {
			number.textContent = pad(index + 1);

			if (animate && !reducedMotion) {
				gsap.fromTo(
					number,
					{ autoAlpha: 0, y: 26 },
					{ autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out", overwrite: "auto" },
				);
			} else {
				gsap.set(number, { autoAlpha: 1, y: 0 });
			}
		}

		if (progress) {
			gsap.to(progress, {
				width: `${((index + 1) / panels.length) * 100}%`,
				duration: animate && !reducedMotion ? 0.55 : 0,
				ease: "power2.out",
				overwrite: "auto",
			});
		}

		panelTimeline?.kill();
		gsap.killTweensOf(panels);

		if (!animate || reducedMotion) {
			panels.forEach((panel, panelIndex) => {
				gsap.set(panel, {
					autoAlpha: panelIndex === index ? 1 : 0,
					y: 0,
					pointerEvents: panelIndex === index ? "auto" : "none",
				});
			});
			playActiveVideo(index);
			return;
		}

		const nextPanel = panels[index];

		if (!nextPanel) {
			return;
		}

		panelTimeline = gsap.timeline();

		panels.forEach((panel, panelIndex) => {
			if (panelIndex === index) {
				return;
			}

			panelTimeline?.to(
				panel,
				{
					autoAlpha: 0,
					y: -22,
					pointerEvents: "none",
					duration: 0.28,
					ease: "power2.in",
				},
				0,
			);
		});

		panelTimeline.fromTo(
			nextPanel,
			{ autoAlpha: 0, y: 34, pointerEvents: "auto" },
			{ autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" },
			0.04,
		);

		playActiveVideo(index);
	};

	const readActiveIndex = (): number => {
		let index = 0;

		steps.forEach((step, stepIndex) => {
			if (step.getBoundingClientRect().top <= 2) {
				index = stepIndex;
			}
		});

		return index;
	};

	const syncActiveToScroll = (animate: boolean): void => {
		setActive(readActiveIndex(), animate);
	};

	const onScroll = (): void => {
		if (scrollFrame !== null) {
			return;
		}

		scrollFrame = window.requestAnimationFrame(() => {
			scrollFrame = null;
			syncActiveToScroll(true);
		});
	};

	const onResize = (): void => {
		if (resizeTimer !== null) {
			window.clearTimeout(resizeTimer);
		}

		resizeTimer = window.setTimeout(() => {
			resizeTimer = null;
			syncActiveToScroll(false);
		}, 120);
	};

	const scrollToStep = (index: number): void => {
		const step = steps[index];

		if (!step) {
			return;
		}

		const top = step.getBoundingClientRect().top + window.scrollY;

		window.scrollTo({
			top,
			behavior: reducedMotion ? "auto" : "smooth",
		});
	};

	const onRailClick = (event: MouseEvent): void => {
		const button = event.currentTarget;

		if (!(button instanceof HTMLButtonElement)) {
			return;
		}

		const index = Number(button.dataset.storyGo);

		if (Number.isNaN(index)) {
			return;
		}

		scrollToStep(index);
	};

	buttons.forEach((button) => {
		button.addEventListener("click", onRailClick);
	});

	window.addEventListener("scroll", onScroll, { passive: true });
	window.addEventListener("resize", onResize);

	setActive(0, false);
	syncActiveToScroll(false);

	const hashIndex = steps.findIndex((step) => `#${step.id}` === window.location.hash);

	if (hashIndex >= 0) {
		window.requestAnimationFrame(() => {
			const step = steps[hashIndex];

			if (!step) {
				return;
			}

			window.scrollTo({
				top: step.getBoundingClientRect().top + window.scrollY,
				behavior: "auto",
			});
			syncActiveToScroll(false);
		});
	}

	return () => {
		panelTimeline?.kill();
		gsap.killTweensOf([...panels, progress, number].filter(Boolean));
		buttons.forEach((button) => button.removeEventListener("click", onRailClick));
		window.removeEventListener("scroll", onScroll);
		window.removeEventListener("resize", onResize);

		if (scrollFrame !== null) {
			window.cancelAnimationFrame(scrollFrame);
		}

		if (resizeTimer !== null) {
			window.clearTimeout(resizeTimer);
		}

		videos.forEach((video) => video.pause());
	};
}

initProductStory();
