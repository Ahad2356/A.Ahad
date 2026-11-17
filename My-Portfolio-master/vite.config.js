import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'portfolio-react-routes',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Legacy HTML filenames otherwise shadow React's extensionless routes.
          if (req.headers.accept?.includes('text/html') && /^\/(projects|services|about|weather-app|todo-app)(\/|\?|$)/.test(req.url)) {
            req.url = '/index.html';
          }
          next();
        });
      },
    },
  ],
  server: {
    port: 5173,
    open: false,
  },
});
