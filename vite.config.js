import { defineConfig } from "vite";
export default defineConfig({
    base: '/Robot-Bros/',
    build: {
        target: 'es2020'
    },
    optimizeDeps: {
        esbuildOptions: 'es2020'
    }
})