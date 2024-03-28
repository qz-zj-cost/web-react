import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // base: "/demo",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __VITE_ENV_DATE__: JSON.stringify(
      `${new Date().getFullYear()}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}`,
    ),
    __VITE_ENV_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  server: {
    proxy: {
      "/*": {
        target: "http://42.192.80.181:9071",
        changeOrigin: true,
      },
    },
    open: true,
    host: "0.0.0.0",
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // plugins: [
      //   visualizer({
      //     gzipSize: true,
      //     brotliSize: true,
      //     emitFile: false,
      //     filename: "visualizer.html", //分析图生成的文件名
      //     open: true,
      //   }),
      // ],
      output: {
        manualChunks: {
          antd: ["antd"],
          antdComponents: ["@ant-design/pro-components"],
        },
      },
    },
  },
});
