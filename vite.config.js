import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          chart: ["chart.js", "react-chartjs-2"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          react: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
