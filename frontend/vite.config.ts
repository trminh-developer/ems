import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true, // Lắng nghe trên mọi card mạng (0.0.0.0) để chia sẻ ra ngoài mạng LAN hoặc Dev Tunnels
    port: 5173,
    allowedHosts: true, // Share Port connect of app
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
