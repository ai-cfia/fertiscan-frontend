import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
dotenv.config();
// https://vitejs.dev/config/
// eslint-disable-next-line
// @ts-ignore
export default ({ mode }) =>
  defineConfig({
    plugins: [react()],
    define: {
      "process.env": { ...process.env, ...loadEnv(mode, process.cwd()) },
    },
  });
