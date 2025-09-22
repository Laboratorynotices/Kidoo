import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === "ghpages" ? "/Kidoo/" : "/";

  return {
    plugins: [vue(), tailwindcss()],
    base,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      __APP_BASE__: JSON.stringify(base),
    },
  };
});
