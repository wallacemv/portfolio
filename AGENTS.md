# Portfolio — Dev Notes

## Project
Portfolio website with React + Vite + Ant Design, deployed via Docker on VPS `104.251.211.44`.

- **Vite base:** `/portfolio/` — always use `import.meta.env.BASE_URL` for image paths
- **Dev:** `npm run dev` (port 5173)
- **Build + deploy:** `npm run deploy:docker` (rsync → Docker build/run)

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

### Chat Page
- Removed `prompt()` on load; generates random username, saves to localStorage
- Username editing: EditOutlined icon → inline input + OK button

## Dependencies
- `potrace` is used; `imagetracerjs` and `pica` unused but still in `package.json`
