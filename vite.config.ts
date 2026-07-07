import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Default base suits github.io/<repo>/. Deploy workflow passes --base / for litanies.volkula.com.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/litanies-generator/" : "/",
}));
