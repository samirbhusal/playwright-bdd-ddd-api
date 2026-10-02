import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(__dirname, "../../.env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

export const runConfig = {
  platform: process.env.PLATFORM || "api",
  env: process.env.ENV || "dev",
  tags: process.env.TAGS || "",
};
