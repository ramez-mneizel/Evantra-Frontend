import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The proxy forwards every /api request to the Express backend,
// so the browser never hits a CORS problem during development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:5000" },
  },
});
