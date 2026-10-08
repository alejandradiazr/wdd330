import { defineConfig } from "vite";

export default defineConfig({
    root: "src",
    base: process.env.NODE_ENV === "production"
        ? "/wdd330/miso-maybe/"
        : "/",
    build: {
        outDir: "../dist",
        emptyOutDir: true,
    },
});