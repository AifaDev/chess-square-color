import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Chess Square Color Quiz",
        short_name: "Chess Quiz",
        description:
          "A quiz app that asks you to guess the color of a chess square",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icons/chessboard.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
