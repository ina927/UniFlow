import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./__tests__/utils/jest.setup.ts", // adjust path if needed
    globals: true,
    coverage: {
      reporter: ["text", "html"],
    },
  },
});