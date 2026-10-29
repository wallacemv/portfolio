// Gera o PDF do currículo a partir de public/cv/pt.md (a única fonte de verdade
// do CV: markdown servido em /portfolio/cv/pt.md).
//
//   node scripts/build-cv-pdf.mjs
//
// Usa o Chromium do Playwright (já usado no prerender) para imprimir um HTML
// A4 estilizado. O PDF gerado é commitado — quem baixa não depende de build.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(
	process.env.PLAYWRIGHT_DIR
		? `${process.env.PLAYWRIGHT_DIR}/playwright`
		: '/Users/wallace/.npm/_npx/705bc6b22212b352/node_modules/playwright',
);

const ROOT = resolve(import.meta.dirname, '..');
const MD = resolve(ROOT, 'public/cv/pt.md');
const PDF = resolve(ROOT, 'public/cv/wallace-martins-vieira.pdf');
const HTML = resolve(ROOT, '.tmp/cv-print.html');

const esc = (s) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// markdown mínimo → HTML: só o que o CV usa (títulos, listas, negrito, itálico, links)
function inline(text) {
	let out = esc(text);
	out = out.replace(
		/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
		(_, label, url) => `<a href="${url}">${label}</a>`,
	);
	out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
	out = out.replace(/(^|[^\w])_([^_]+)_/g, '$1<em>$2</em>');
	out = out.replace(
		/(^|[\s(])(https?:\/\/[^\s<)]+)/g,
		(_, pre, url) => `${pre}<a href="${url}">${url}</a>`,
	);
	return out;
}

function toHtml(md) {
	const lines = md.split('\n');
	const out = [];
	let list = null;

	const closeList = () => {
		if (list) {
			out.push(`</${list}>`);
			list = null;
		}
	};

	for (const raw of lines) {
		const line = raw.trim();
		if (!line) {
			closeList();
			continue;
		}
		const heading = line.match(/^(#{1,3})\s+(.*)$/);
		if (heading) {
			closeList();
			const level = heading[1].length;
			out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
			continue;
		}
		const item = line.match(/^[-*]\s+(.*)$/);
		if (item) {
			if (list !== 'ul') {
				closeList();
				out.push('<ul>');
				list = 'ul';
			}
			out.push(`<li>${inline(item[1])}</li>`);
			continue;
		}
		closeList();
		out.push(`<p>${inline(line)}</p>`);
	}
	closeList();
	return out.join('\n');
}

const css = `
	@page { size: A4; margin: 14mm 15mm; }
	* { box-sizing: border-box; }
	body {
		font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
		font-size: 10.2pt; line-height: 1.45; color: #111827; margin: 0;
	}
	h1 { font-size: 19pt; margin: 0 0 4px; letter-spacing: -0.2px; }
	h1 + p { color: #374151; font-size: 9.6pt; margin: 0 0 2px; }
	h2 {
		font-size: 11.4pt; text-transform: uppercase; letter-spacing: 0.6px;
		margin: 14px 0 6px; padding-bottom: 3px; border-bottom: 1px solid #d1d5db;
		color: #111827; break-after: avoid;
	}
	h3 { font-size: 10.6pt; margin: 9px 0 2px; break-after: avoid; }
	h3 + p { margin: 0 0 3px; color: #4b5563; font-size: 9.4pt; }
	p { margin: 0 0 6px; }
	ul { margin: 0 0 6px; padding-left: 15px; }
	li { margin: 0 0 2.5px; }
	strong { color: #111827; }
	em { color: #4b5563; font-style: normal; font-size: 9.2pt; }
	a { color: #1d4ed8; text-decoration: none; }
	h2, h3, li, p { orphans: 3; widows: 3; }
`;

const md = readFileSync(MD, 'utf8');
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
<title>Wallace Martins Vieira — Currículo</title><style>${css}</style></head>
<body>${toHtml(md)}</body></html>`;

// `.tmp/` é ignorado pelo git — num clone limpo a pasta não existe.
mkdirSync(resolve(ROOT, '.tmp'), { recursive: true });
writeFileSync(HTML, html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.pdf({
	path: PDF,
	format: 'A4',
	printBackground: true,
	margin: { top: '14mm', bottom: '14mm', left: '15mm', right: '15mm' },
	displayHeaderFooter: true,
	headerTemplate: '<div></div>',
	footerTemplate:
		'<div style="width:100%;font-family:Helvetica,Arial,sans-serif;font-size:7.5pt;color:#9ca3af;padding:0 15mm;">Wallace Martins Vieira — wallacemv@gmail.com — linkedin.com/in/wallacemarttins — <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
});
await browser.close();

console.log(`PDF gerado: ${PDF}`);
