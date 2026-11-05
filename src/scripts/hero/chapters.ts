import type { Product } from "../../data/products";
import type { HeroChapter, HeroChapterMap } from "../../types/hero";

export function buildChapterMap(products: readonly Product[]): HeroChapterMap {
	const chapters: Record<string, HeroChapter> = {};
	for (const product of products) {
		chapters[product.slug] = {
			slug: product.slug,
			headline: product.headline,
			blurb: product.blurb,
			cta: product.cta,
			href: product.href,
		};
	}
	return chapters;
}
