import type { Product } from "../data/products";

export type HeroChapter = Pick<Product, "slug" | "headline" | "blurb" | "cta" | "href">;
export type HeroChapterMap = Readonly<Record<string, HeroChapter>>;

export interface NavLink {
	label: string;
	href: string;
}
