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
- New `/projects` route listing the main projects as cards (SexyBot, Shop Commerce, Photojobs): description, stack tags, GitHub + live links

### Infra Page
- New `/infra` route explaining the production infra: VPS Ubuntu 22.04, k3s, Docker+containerd, Nginx host + Let's Encrypt, apps hosted (portfolio, websocket, sexybot, shop-commerce, photojobs), and the deploy flow (git pull → docker build → ctr import → kubectl apply → rollout)

### Chat Page
- Removed `prompt()` on load; generates random username, saves to localStorage
- Username editing: EditOutlined icon → inline input + OK button
- Chat is now a floating widget (`src/components/ChatWidget.jsx`), FAB bottom-right, global on all pages; WebSocket connects on open, disconnects on close; only error toasts. `/chat` route and menu item removed.

### Design harmonization (Aug 17, 2026)
- Single dark palette: all pages on `#0f172a` base with a subtle per-page radial tint (indigo, purple, teal, red, blue)
- Header/footer neutral dark; page color only on the active menu underline
- Floating bubbles now light translucent tones (were dark, invisible on dark bg)
- Home: photo filter sobered (was psychedelic), experience cards neutral with colored left border
- Shapes page removed (menu, route, file); its sine-flow wave animation moved into the Paint page background (rAF)
- About menu label is now "Sobre"

## Dependencies
- `potrace` is used; `imagetracerjs` and `pica` unused but still in `package.json`
