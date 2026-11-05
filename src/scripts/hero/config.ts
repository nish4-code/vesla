export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const LABEL_SELECTOR = ".t";
export const HOVER_TARGET_SELECTOR = "a, button";
export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const SCRAMBLE_DURATION_MS = 400;
export const SCRAMBLE_ROLL_INTERVAL_MS = 45;
export const SCRAMBLE_TAIL_LENGTH = 3.6;
export const SCROLL_THRESHOLD_PX = 24;
export const MOBILE_MENU_BREAKPOINT_PX = 830;
export const SCENE_FADE_MS = 950;
export const HERO_SWAP_MS = 500;
export const LABEL_RESERVE_DEBOUNCE_MS = 160;
export const MENU_FOCUS_DELAY_MS = 80;
export const RAIL_AUTOPLAY_INTERVAL_MS = 5000;
export const INTRO_SETTLE_DELAY_MS = 2600;

export interface IntroStep {
	selector: string;
	delay: number;
	step?: number;
}

export const INTRO_SCHEDULE: readonly IntroStep[] = [
	{ selector: ".enter .t", delay: 330 },
	{ selector: ".menu .t", delay: 390 },
	{ selector: ".links a .t", delay: 360, step: 45 },
	{ selector: ".index li.on .t", delay: 660 },
	{ selector: ".index li:not(.on) .t", delay: 720, step: 55 },
	{ selector: ".cta .t", delay: 900 },
	{ selector: ".dock .t", delay: 1000, step: 60 },
];
