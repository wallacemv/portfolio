import { useEffect } from 'react';

export const SITE_URL = 'https://codedbywallace.dev';
export const BASE_URL = `${SITE_URL}/portfolio`;
const DEFAULT_IMAGE = `${SITE_URL}/portfolio/images/paint.webp`;

const JSON_LD_KEY = 'page-jsonld';

function upsertMeta(attr, key, content) {
	let el = document.head.querySelector(`meta[${attr}="${key}"]`);
	if (!el) {
		el = document.createElement('meta');
		el.setAttribute(attr, key);
		document.head.appendChild(el);
	}
	el.setAttribute('content', content);
}

function removeMeta(attr, key) {
	document.head
		.querySelectorAll(`meta[${attr}="${key}"]`)
		.forEach((m) => m.remove());
}

function setCanonical(href) {
	document.head.querySelectorAll('link[rel="canonical"]').forEach((l) => l.remove());
	if (!href) return;
	const link = document.createElement('link');
	link.setAttribute('rel', 'canonical');
	link.setAttribute('href', href);
	document.head.appendChild(link);
}

function setPageJsonLd(jsonLd) {
	document.head.querySelectorAll(`script[data-seo="${JSON_LD_KEY}"]`).forEach((s) => s.remove());
	if (!jsonLd) return;
	const script = document.createElement('script');
	script.type = 'application/ld+json';
	script.setAttribute('data-seo', JSON_LD_KEY);
	script.textContent = JSON.stringify(jsonLd);
	document.head.appendChild(script);
}

/**
 * Aplica title, description, canonical, OG/Twitter e JSON-LD no <head>.
 * Idempotente: cada chamada substitui as tags anteriores.
 */
export function applyPageMeta({ title, description, path, image, jsonLd, noIndex, canonical }) {
	const url = canonical || (path ? `${BASE_URL}${path}` : undefined);

	if (title) {
		document.title = title;
		upsertMeta('property', 'og:title', title);
		upsertMeta('name', 'twitter:title', title);
	}
	if (description) {
		upsertMeta('name', 'description', description);
		upsertMeta('property', 'og:description', description);
		upsertMeta('name', 'twitter:description', description);
	} else {
		removeMeta('name', 'description');
		removeMeta('property', 'og:description');
		removeMeta('name', 'twitter:description');
	}

	upsertMeta('property', 'og:type', 'website');
	upsertMeta('property', 'og:site_name', 'Wallace Martins Vieira — Portfolio');
	upsertMeta('property', 'og:image', image || DEFAULT_IMAGE);
	upsertMeta('name', 'twitter:image', image || DEFAULT_IMAGE);
	upsertMeta('name', 'twitter:card', 'summary_large_image');

	if (url) {
		setCanonical(url);
		upsertMeta('property', 'og:url', url);
		upsertMeta('name', 'twitter:url', url);
	} else {
		setCanonical(undefined);
		removeMeta('property', 'og:url');
		removeMeta('name', 'twitter:url');
	}

	if (noIndex) upsertMeta('name', 'robots', 'noindex, follow');
	else removeMeta('name', 'robots');

	setPageJsonLd(jsonLd);
}

/**
 * Hook de SEO por página. Roda a cada render para cobrir a navegação SPA.
 */
export function usePageMeta(config) {
	useEffect(() => {
		applyPageMeta(config);
	});
}
