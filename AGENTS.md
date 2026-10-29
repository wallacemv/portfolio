# Portfolio — Dev Notes

## Project
Portfolio website with React + Vite + Ant Design, deployed on Kubernetes (k3s) on VPS `104.251.211.44`.

- **Vite base:** `/portfolio/` — always use `import.meta.env.BASE_URL` for image paths
- **Dev:** `npm run dev` (port 5173)
- **Deploy:** commit + push → `deploy/deploy.sh` roda **no servidor** (`git fetch` + `reset --hard origin/master` → docker build → `ctr` import → kubectl apply/rollout). Local: `npm run deploy` roda o script localmente e não funciona — o deploy é via SSH no `/opt/portfolio`.
- **Live:** https://codedbywallace.dev/portfolio — host Nginx proxies `/portfolio/` to the k8s service `portfolio.default.svc.cluster.local:80` (config in the server's `sites-enabled/codedbywallace.dev`)

## UI Work Done (Jul 7, 2026)

### Home Page
- Title: "Full Stack Developer | Node.js • TypeScript • Angular • Java"
- Bio: removed "Inglês profissional" and "Atualmente atuo como Fullstack na Sem Parar"
- Sem Parar: changed from "Presente" to "Jul 2026"
- Removed old experiences (Publicar, Scala, Provider IT); kept Sem Parar, HDI, Vivo, Elocc
- 15 dynamically generated floating circles (random colors, sizes, velocities) + 1 image circle (`paint.webp`) using `requestAnimationFrame` with window bounds
- Circles are `fixed` relative to viewport, not per-section
- Photo (`paint.webp`) inside `.pic` div: absolute right-aligned, 300×300, `rounded-full`, `opacity-50`, `brightness(1.9)`
- Right section background: purple `#7600dc` (same as left)
- Circles always animate (no pause button) with reduced velocity (0.5) and mouse-avoidance (repulsion within 150px, 0.98 damping)

### About Page
- Removed ImageTracerJS and Pica (unused deps)

### Projects Page
- New `/projects` route listing the main projects as cards (Shop Commerce): description, stack tags, GitHub + live links (SexyBot e Photojobs removidos em Oct 8, 2026)

### Infra Page
- New `/infra` route explaining the production infra: VPS Ubuntu 22.04, k3s, Docker+containerd, Nginx host + Let's Encrypt, apps hosted (portfolio, websocket, shop-commerce), and the deploy flow (git pull → docker build → ctr import → kubectl apply → rollout)

### Chat Page
- Removed `prompt()` on load; generates random username, saves to localStorage
- Username editing: EditOutlined icon → inline input + OK button
- Chat is now a floating widget (`src/components/ChatWidget.jsx`), FAB bottom-right, global on all pages; WebSocket connects on open, disconnects on close. `/chat` route and menu item removed.
- **Conversa individual (Oct 19, 2026):** cada visitante fala só com o assistente (Gemini) do outro lado do `wss://codedbywallace.dev/websocket` — o servidor não faz broadcast, não manda histórico de outras pessoas e não publica presença ("X entrou/saiu"). O widget manda `{type:'join', username}` ao abrir e recebe o welcome personalizado; a própria mensagem é renderizada localmente (o filtro de eco é por `type:'user'` + nome, nunca só por nome — o assistente também assina "Wallace"). E2E: `.scratch/check-chat-widget.mjs` (Chrome headless via CDP, contra produção).
- **Conversa salva + moderação (Oct 19, 2026):** a conversa fica em `localStorage` (`chatConversation`, máx. 100 mensagens, por apelido; trocar de apelido zera). No `join` o widget reenvia as últimas 20 como `history` → o servidor reconstrói o contexto do Gemini e **não** manda welcome de novo (a conversa continua de onde parou); o servidor continua sem persistir nada. Palavrões/ofensas são mascarados (`merda` → `m****`) nos dois lados: o widget mascara a própria mensagem antes de renderizar/salvar/servidor, o servidor mascara a resposta do assistente e o contexto. Lista espelhada: `src/lib/moderation.js` ↔ `node-websocket-server/lib/moderation.js` — mudar uma exige mudar a outra. Apelido também é mascarado (quem entra como "FDP" aparece "F**").

### Design harmonization (Aug 17, 2026)
- Single dark palette: all pages on `#0f172a` base with a subtle per-page radial tint (indigo, purple, teal, red, blue)
- Header/footer neutral dark; page color only on the active menu underline
- Floating bubbles now light translucent tones (were dark, invisible on dark bg)
- Home: photo filter sobered (was psychedelic), experience cards neutral with colored left border
- Shapes page removed (menu, route, file); its sine-flow wave animation moved into the Paint page background (rAF)
- About menu label is now "Sobre"

## Dependencies
- `potrace` is used; `imagetracerjs` and `pica` unused but still in `package.json`

## CV (`public/cv/`)
- `pt.md` é a **fonte única** do currículo (servido em `/portfolio/cv/pt.md`); o servidor do chat busca esse arquivo no boot e usa uma cópia em `node-websocket-server-main/assets/pt.md` como fallback
- `wallace-martins-vieira.pdf` é gerado a partir do `pt.md` por `npm run cv:pdf` (`scripts/build-cv-pdf.mjs`, Chromium do Playwright) e **commitado** — rode de novo sempre que o `pt.md` mudar
- Link de download: "Baixar currículo em PDF" na página Sobre; o assistente do chat também manda a URL quando pedem o CV
- O widget do chat transforma URL solta e `[texto](url)` em link clicável (`renderMessageText`)
