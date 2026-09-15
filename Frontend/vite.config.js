import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      "Cache-Control": "no-store",
    },
  },
  preview: {
    headers: {
      "Cache-Control": "no-store",
    },
  },
});
