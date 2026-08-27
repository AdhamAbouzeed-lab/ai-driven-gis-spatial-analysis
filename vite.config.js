import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    sourcemap: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          maplibre: ["maplibre-gl"],
          turf: ["@turf/turf"],
          charts: ["chart.js"],
        }
      }
    }
  },
  server: {
    host: true
  }
});
