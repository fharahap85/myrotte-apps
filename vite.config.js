import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "https://dreampos.id",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/admin/api"),
      },
    },
  },
});
