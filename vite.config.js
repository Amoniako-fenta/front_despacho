import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,

    proxy: {
      "/api/v1/ventas": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },

      "/api/v1/despachos": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
    },
  },

  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});