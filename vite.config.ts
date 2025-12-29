import { readFileSync } from "fs";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import { defineConfig } from "vite";

// vite plugins
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import Fonts from "unplugin-fonts/vite";
import imagemin from "unplugin-imagemin/vite";
import { compression } from "vite-plugin-compression2";
import Inspect from "vite-plugin-inspect";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import { fonts } from "./config/fonts.config";

// Read version from package.json
const packageJson = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  base: "./", // Required for Capacitor to load assets correctly
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(packageJson.version),
  },
  plugins: [
    svgr(),
    react(),
    Inspect(),
    compression(),
    imagemin(),
    tailwindcss(),
    Fonts({ google: { families: fonts } }),
    // AutoImport({
    //   imports: ["react", "react-router"],
    //   dts: "./auto-imports.d.ts",
    //   eslintrc: { filepath: "./eslint.config.js" },
    //   dirs: ["./src/components/atoms"],
    // }),
    VitePWA({
      registerType: "autoUpdate",
      // injectRegister: "auto",
      includeAssets: ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "IDICO CRM",
        short_name: "IDICO CRM",
        description: "IDICO CRM - Customer Relationship Management System",
        theme_color: "#074747",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait-primary",
        icons: [
          {
            src: "pwa-192x192.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
          {
            src: "pwa-512x512.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) => {
              return url.pathname.startsWith("/api/");
            },
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        importScripts: ['./sw-custom.js'],
        // Exclude firebase-messaging-sw.js from being controlled by Workbox
        // navigateFallbackDenylist: [/^\/firebase-messaging-sw\.js$/],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: [
      { find: /^@atoms\/(.+)$/, replacement: path.resolve(__dirname, "./src/components/atoms/$1") },
      { find: "@atoms", replacement: path.resolve(__dirname, "./src/components/atoms") },
      { find: /^@molecules\/(.+)$/, replacement: path.resolve(__dirname, "./src/components/molecules/$1") },
      { find: "@molecules", replacement: path.resolve(__dirname, "./src/components/molecules") },
      { find: /^@organisms\/(.+)$/, replacement: path.resolve(__dirname, "./src/components/organisms/$1") },
      { find: "@organisms", replacement: path.resolve(__dirname, "./src/components/organisms") },
      { find: /^@templates\/(.+)$/, replacement: path.resolve(__dirname, "./src/components/templates/$1") },
      { find: "@templates", replacement: path.resolve(__dirname, "./src/components/templates") },
      { find: /^@pages\/(.+)$/, replacement: path.resolve(__dirname, "./src/components/pages/$1") },
      { find: "@pages", replacement: path.resolve(__dirname, "./src/components/pages") },
      { find: /^@features\/(.+)$/, replacement: path.resolve(__dirname, "./src/features/$1") },
      { find: "@features", replacement: path.resolve(__dirname, "./src/features") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
  build: {
    outDir: "build/web",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true, // Fail if port is already in use
  },
  preview: {
    port: 3000,
    strictPort: true, // Fail if port is already in use
  },
});
