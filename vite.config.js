import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		{
			name: 'redirect-trailing-slash',
			configureServer(server) {
				server.middlewares.use((req, res, next) => {
					if (req.url === '/portfolio') {
						res.writeHead(302, { Location: '/portfolio/' });
						res.end();
						return;
					}
					next();
				});
			},
		},
	],
	base: '/portfolio/',
	build: {
		chunkSizeWarningLimit: 1600,
	},
});
