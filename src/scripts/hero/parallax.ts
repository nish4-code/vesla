interface ParallaxState {
	targetX: number;
	targetY: number;
	currentX: number;
	currentY: number;
	frame: number | null;
}

export interface ParallaxController {
	destroy(): void;
}

export function createParallax(
	background: HTMLElement | null,
	reducedMotion: boolean,
): ParallaxController {
	if (!background || reducedMotion) return { destroy: () => {} };

	const state: ParallaxState = {
		targetX: 0,
		targetY: 0,
		currentX: 0,
		currentY: 0,
		frame: null,
	};

	const tick = (): void => {
		state.currentX += (state.targetX - state.currentX) * 0.045;
		state.currentY += (state.targetY - state.currentY) * 0.045;

		const width = window.innerWidth;
		const height = window.innerHeight;
		const deltaX = -state.currentX * width * 0.0156;
		const deltaY = -state.currentY * height * 0.015;
		const cover =
			2 * Math.max(Math.abs(deltaX) / width, Math.abs(deltaY) / height);
		const scale =
			1 + cover + 0.014 * Math.max(0, state.currentY);

		background.style.transform = `translate3d(${deltaX.toFixed(2)}px,${deltaY.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;

		if (
			Math.abs(state.targetX - state.currentX) < 0.0004 &&
			Math.abs(state.targetY - state.currentY) < 0.0004
		) {
			state.frame = null;
			return;
		}

		state.frame = requestAnimationFrame(tick);
	};

	const wake = (): void => {
		if (state.frame === null) state.frame = requestAnimationFrame(tick);
	};

	const onPointerMove = (event: PointerEvent): void => {
		if (event.pointerType === "touch") return;
		state.targetX = (event.clientX / window.innerWidth) * 2 - 1;
		state.targetY = (event.clientY / window.innerHeight) * 2 - 1;
		wake();
	};

	const onPointerLeave = (): void => {
		state.targetX = 0;
		state.targetY = 0;
		wake();
	};

	window.addEventListener("pointermove", onPointerMove, { passive: true });
	document.addEventListener("pointerleave", onPointerLeave);

	return {
		destroy: () => {
			window.removeEventListener("pointermove", onPointerMove);
			document.removeEventListener("pointerleave", onPointerLeave);
			if (state.frame !== null) cancelAnimationFrame(state.frame);
		},
	};
}
