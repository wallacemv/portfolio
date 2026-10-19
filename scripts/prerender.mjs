#!/usr/bin/env node
/**
 * Prerender das rotas do portfólio.
 *
 * Gera `dist/index.html` e `dist/<rota>/index.html` com o DOM já renderizado,
 * para que crawlers que não executam JavaScript (Gemini, GPTBot, ClaudeBot,
 * Bing em parte) vejam o conteúdo e as metatags corretas por rota.
 *
 * Sem dependências novas: sobe um servidor estático do `dist`, dirige um
 * Chrome/Chromium headless via CDP cru (WebSocket global do Node 22+) e salva
 * o HTML capturado. Se qualquer rota sair sem canonical correto ou com pouco
 * texto, o script falha (exit 1) em vez de publicar página vazia.
 *
 * Env:
 *   CHROME_BIN          binário do navegador (default: candidatos do sistema)
 *   PRERENDER_PORT      porta do servidor estático (default 4180)
 *   PRERENDER_DEBUG_PORT  porta do CDP (default PRERENDER_PORT + 1)
 *   PRERENDER_ROUTES    rotas separadas por vírgula (default /,/about,/projects,/infra,/paint)
 *   PRERENDER_MIN_TEXT  mínimo de caracteres de texto por rota (default 200)
 *   PRERENDER_SETTLE    ms de espera após o mount, para efeitos de SEO (default 600)
 */

import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const BASE = '/portfolio';
const PORT = Number(process.env.PRERENDER_PORT || 4180);
const DEBUG_PORT = Number(process.env.PRERENDER_DEBUG_PORT || PORT + 1);
const MIN_TEXT = Number(process.env.PRERENDER_MIN_TEXT || 200);
const SETTLE_MS = Number(process.env.PRERENDER_SETTLE || 600);
const ROUTES = (process.env.PRERENDER_ROUTES || '/,/about,/projects,/infra,/paint')
	.split(',')
	.map((r) => r.trim())
	.filter(Boolean);

/**
 * Mínimo de texto por rota. `/paint` é uma tela interativa (canvas + dedicatória):
 * o conteúdo legítimo dela tem ~120 caracteres, então o piso padrão a reprovaria.
 * O piso existe para pegar render vazio/quebrado, não para medir densidade de texto.
 */
const MIN_TEXT_BY_ROUTE = { '/paint': 80 };
const minTextFor = (route) => MIN_TEXT_BY_ROUTE[route] ?? MIN_TEXT;

const CHROME_CANDIDATES = [
	process.env.CHROME_BIN,
	'/usr/bin/chromium-browser',
	'/usr/bin/chromium',
	'/usr/bin/google-chrome',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.mjs': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.webp': 'image/webp',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.ico': 'image/x-icon',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8',
	'.xml': 'application/xml; charset=utf-8',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function resolveChrome() {
	const found = CHROME_CANDIDATES.find((p) => existsSync(p));
	if (!found) {
		throw new Error(`nenhum navegador encontrado. Defina CHROME_BIN (tentei: ${CHROME_CANDIDATES.join(', ')})`);
	}
	return found;
}

/** `/portfolio/about` -> `dist/about/index.html`; rota sem arquivo cai no shell do SPA. */
function resolveFile(pathname) {
	let rel = decodeURIComponent(pathname);
	if (rel.startsWith(BASE)) rel = rel.slice(BASE.length);
	if (rel === '' || rel.endsWith('/')) rel += 'index.html';
	const file = resolve(DIST, `.${rel}`);
	if (!file.startsWith(DIST)) return null;
	if (existsSync(file) && statSync(file).isFile()) return file;
	if (extname(rel)) return null;
	const shell = join(DIST, 'index.html');
	return existsSync(shell) ? shell : null;
}

function startStaticServer() {
	const server = createServer((req, res) => {
		const { pathname } = new URL(req.url, `http://127.0.0.1:${PORT}`);
		const file = resolveFile(pathname);
		if (!file) {
			res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
			res.end('not found');
			return;
		}
		res.writeHead(200, {
			'content-type': MIME[extname(file)] || 'application/octet-stream',
			'cache-control': 'no-store',
		});
		res.end(readFileSync(file));
	});
	return new Promise((ok, err) => {
		server.on('error', err);
		server.listen(PORT, '127.0.0.1', () => ok(server));
	});
}

async function waitForCdpTarget(timeoutMs = 30000) {
	const until = Date.now() + timeoutMs;
	while (Date.now() < until) {
		try {
			const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
			const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
			if (page) return page.webSocketDebuggerUrl;
		} catch {
			// servidor de debug ainda não subiu
		}
		await sleep(250);
	}
	throw new Error(`CDP não respondeu em ${timeoutMs / 1000}s`);
}

function connectCdp(wsUrl) {
	return new Promise((ok, err) => {
		const ws = new WebSocket(wsUrl);
		const pending = new Map();
		let seq = 0;

		ws.addEventListener('open', () =>
			ok({
				send(method, params = {}) {
					return new Promise((res, rej) => {
						const id = ++seq;
						pending.set(id, { res, rej });
						ws.send(JSON.stringify({ id, method, params }));
					});
				},
				close() {
					try {
						ws.close();
					} catch {
						// já fechado
					}
				},
			})
		);
		ws.addEventListener('error', () => err(new Error('falha ao abrir o WebSocket do CDP')));
		ws.addEventListener('message', (event) => {
			const msg = JSON.parse(event.data);
			const entry = pending.get(msg.id);
			if (!entry) return;
			pending.delete(msg.id);
			if (msg.error) entry.rej(new Error(msg.error.message));
			else entry.res(msg.result);
		});
	});
}

async function evaluate(cdp, expression) {
	const { result } = await cdp.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
	return result?.value;
}

async function waitForReady(cdp, route) {
	const until = Date.now() + 25000;
	let last = null;
	while (Date.now() < until) {
		last = await evaluate(
			cdp,
			`(() => {
				const root = document.querySelector('#root');
				return { ready: document.readyState, children: root ? root.childElementCount : -1, title: document.title };
			})()`
		);
		if (last?.ready === 'complete' && last.children > 0 && last.title) return last;
		await sleep(150);
	}
	throw new Error(`rota ${route} não ficou pronta em 25s (último estado: ${JSON.stringify(last)})`);
}

async function main() {
	if (typeof WebSocket === 'undefined') throw new Error('Node 22+ necessário (WebSocket global ausente)');
	if (!existsSync(join(DIST, 'index.html'))) throw new Error('dist/index.html não existe — rode `npm run build` antes');

	const chromeBin = resolveChrome();
	const profileDir = mkdtempSync(join(tmpdir(), 'prerender-chrome-'));
	const server = await startStaticServer();
	let chrome = null;
	let chromeStderr = '';
	let cdp = null;

	try {
		chrome = spawn(
			chromeBin,
			[
				'--headless=new',
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-gpu',
				'--hide-scrollbars',
				'--no-first-run',
				'--no-default-browser-check',
				'--disable-extensions',
				'--disable-background-timer-throttling',
				`--user-data-dir=${profileDir}`,
				`--remote-debugging-port=${DEBUG_PORT}`,
				'about:blank',
			],
			{ stdio: ['ignore', 'ignore', 'pipe'] }
		);
		chrome.stderr.on('data', (d) => {
			chromeStderr += d.toString();
		});
		chrome.on('error', (e) => {
			chromeStderr += `spawn error: ${e.message}\n`;
		});

		const wsUrl = await waitForCdpTarget().catch((e) => {
			throw new Error(`${e.message}\n--- stderr do navegador ---\n${chromeStderr.slice(-2000)}`);
		});
		cdp = await connectCdp(wsUrl);
		await cdp.send('Page.enable');

		// 1) captura todas as rotas antes de escrever qualquer arquivo
		const snapshots = [];
		for (const route of ROUTES) {
			const url = `http://127.0.0.1:${PORT}${BASE}${route === '/' ? '/' : route}`;
			await cdp.send('Page.navigate', { url });
			const state = await waitForReady(cdp, route);
			await sleep(SETTLE_MS);
			const html = await evaluate(cdp, 'document.documentElement.outerHTML');
			const text = (await evaluate(cdp, `(() => (document.querySelector('#root')?.innerText ?? '').replace(/\\s+/g, ' ').trim())()`)) ?? '';
			const canonical = (await evaluate(cdp, `(() => document.querySelector('link[rel="canonical"]')?.href ?? '')()`)) ?? '';
			snapshots.push({ route, html: `<!DOCTYPE html>\n${html}`, text, canonical, title: state.title });
		}

		// 2) valida tudo e só então escreve
		const problems = [];
		for (const snap of snapshots) {
			const expected = `${BASE}${snap.route === '/' ? '/' : snap.route}`;
			if (!snap.canonical.endsWith(expected)) {
				problems.push(`${snap.route}: canonical "${snap.canonical || '(vazio)'}" não termina em "${expected}"`);
			}
			if (snap.text.length < minTextFor(snap.route)) {
				problems.push(`${snap.route}: só ${snap.text.length} caracteres de texto (mínimo ${minTextFor(snap.route)})`);
			}
			if (/<div id="root">\s*<\/div>/.test(snap.html)) {
				problems.push(`${snap.route}: #root saiu vazio`);
			}
		}
		if (problems.length) {
			throw new Error(`prerender inválido:\n   - ${problems.join('\n   - ')}`);
		}

		for (const snap of snapshots) {
			const out = snap.route === '/' ? join(DIST, 'index.html') : join(DIST, snap.route.replace(/^\//, ''), 'index.html');
			mkdirSync(dirname(out), { recursive: true });
			writeFileSync(out, snap.html);
			console.log(
				`  ✔ ${snap.route.padEnd(9)} ${(Buffer.byteLength(snap.html) / 1024).toFixed(1)} kB · ${snap.text.length} chars · ${snap.title}`
			);
		}
		console.log(`Prerender ok: ${snapshots.length} rota(s) em ${DIST}`);
	} finally {
		cdp?.close();
		try {
			chrome?.kill('SIGKILL');
		} catch {
			// processo já morto
		}
		await new Promise((r) => server.close(r));
		rmSync(profileDir, { recursive: true, force: true });
	}
}

main().catch((e) => {
	console.error(`\n✖ ${e.message}\n`);
	process.exit(1);
});
