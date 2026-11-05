import { SCENE_FADE_MS } from "./config";

export interface SceneController {
	show(chapter: string): void;
	destroy(): void;
}

export function createSceneController(
	videos: readonly HTMLVideoElement[],
): SceneController {
	const fadeTimers = new Set<number>();

	const showScene = (video: HTMLVideoElement, chapter: string): void => {
		const source = video.dataset.src;
		if (!video.getAttribute("src") && source) {
			video.preload = "auto";
			video.src = source;
			video.load();
		}

		const play = (): void => {
			if (video.dataset.chapter !== chapter) return;
			try {
				video.currentTime = 0;
			} catch {
				// Some browsers reject seeking before metadata is ready.
			}
			const playback = video.play();
			if (playback) playback.catch(() => {});

			for (const other of videos) {
				if (other === video) {
					other.classList.add("on");
					continue;
				}
				if (!other.classList.contains("on")) continue;
				other.classList.remove("on");
				const timer = window.setTimeout(() => {
					if (!other.classList.contains("on")) other.pause();
					fadeTimers.delete(timer);
				}, SCENE_FADE_MS);
				fadeTimers.add(timer);
			}
		};

		if (video.readyState >= 3) play();
		else video.addEventListener("canplay", play, { once: true });
	};

	return {
		show: (chapter) => {
			for (const video of videos) {
				if (video.dataset.chapter === chapter) showScene(video, chapter);
			}
		},
		destroy: () => {
			for (const timer of fadeTimers) window.clearTimeout(timer);
			fadeTimers.clear();
			for (const video of videos) video.pause();
		},
	};
}
