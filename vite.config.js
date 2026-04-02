import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
  server: {
    open: true, // автоматически открывать страницу в браузере
    port: 5173, // порт dev-сервера
  },
  base: "./",
});
