import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "spotlight-vue",
      fileName: "spotlight",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: ["vue", "@vueuse/core"],
    },
    sourcemap: true,
  },
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
});
