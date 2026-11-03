import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (
            req.url &&
            !req.url.startsWith("/@") &&
            !req.url.startsWith("/src") &&
            !req.url.startsWith("/node_modules") &&
            !path.extname(req.url.split("?")[0])
          ) {
            req.url = "/index.html";
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
