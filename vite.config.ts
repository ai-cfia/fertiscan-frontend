import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// eslint-disable-next-line
import basicSsl from "@vitejs/plugin-basic-ssl";
import dotenv from "dotenv";
dotenv.config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
});
