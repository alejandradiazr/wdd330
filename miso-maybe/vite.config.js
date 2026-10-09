
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
    root: "src",

    base:
        process.env.NODE_ENV === "production"
            ? "/wdd330/miso-maybe/"
            : "/",

    build: {
        outDir: "../dist",
        emptyOutDir: true,

        rollupOptions: {
            input: {
                main: resolve(process.cwd(), "src/index.html"),
                recipe: resolve(process.cwd(), "src/recipe/index.html"),
                favorites: resolve(process.cwd(), "src/favorites/index.html"),
            },
        },
    },
});
