import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
// eslint-disable-next-line
import basicSsl from "@vitejs/plugin-basic-ssl";

// eslint-disable-next-line
// @ts-ignore
export default ({ mode }) =>
  defineConfig({
    plugins: [react()],
    define: {
      "process.env": { ...process.env, ...loadEnv(mode, process.cwd()) },
    },
  });
