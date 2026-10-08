import { defineConfig, devices } from "@playwright/test";
import { defineBddProject } from "playwright-bdd";
import reportingLabs from "./reporting-labs.config";
import { ConfigReader } from "./tests/core/ConfigReader";

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ["list"],
    ["./tests/core/selectionErrorReporter.ts"],
    ["reporting-labs", reportingLabs],
  ],
  projects: ConfigReader.getPlatform() === "api" ? [
    {
      ...defineBddProject({
        name: "api",
        features: "./tests/api/**/features/*.feature",
        steps: ["./tests/core/fixtures.ts", "./tests/api/**/stepDefs/*.ts"],
        tags: ConfigReader.getTags(),
      }),
      use: {
        baseURL: ConfigReader.getBaseUrl(),
        trace: "on-first-retry",
      },
    },
  ] : [
    {
      ...defineBddProject({
        name: "web-chromium",
        features: "./tests/web/**/features/*.feature",
        steps: ["./tests/core/fixtures.ts", "./tests/web/**/stepDefs/*.ts"],
        tags: ConfigReader.getTags(),
      }),
      use: {
        ...devices["Desktop Chrome"],
        baseURL: ConfigReader.getBaseUrl(),
        headless: !!process.env.CI,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
      },
    },
  ],
});
