import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/spritesheet-simplify/",
  plugins: [react()],
  assetsInclude: [
    "png",
    "jpe?g",
    "jfif",
    "pjpeg",
    "pjp",
    "gif",
    "svg",
    "ico",
    "webp",
    "avif",
  ],
});
