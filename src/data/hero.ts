import type { NavLink } from "../types/hero";

export const heroNavLinks: readonly NavLink[] = [
	{ label: "ABOUT", href: "#nosotros" },
	{ label: "PRODUCTOS", href: "#productos" },
	{ label: "PROCESO", href: "#proceso" },
	{ label: "PREGUNTAS", href: "#preguntas" },
	{ label: "CONTACTO", href: "#contacto" },
];

export const heroBackground = {
	alt: "Una construcción de piedra frente a un lago en calma, entre montañas, al atardecer",
	poster: "/assets/img/background.webp",
} as const;
