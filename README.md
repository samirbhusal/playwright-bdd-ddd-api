# Playwright BDD Framework

TypeScript test framework using Playwright, Gherkin feature files, and page objects. Step definitions call POM methods through a scenario-scoped `WebPageFactory`.

The current web scenario opens the shop and verifies its login page. Credential entry and login submission are commented out in the feature file and are not implemented yet.

## Project setup

Use Node.js 24 and npm. Run the following commands from the project root:

```sh
npm ci
npx playwright install chromium
```

Create a `.env` file in the project root to select the web tests:

```dotenv
PLATFORM=web
ENV=dev
TAGS=@web
```

Then run:

```sh
npm test
```

The `.env` file is optional and ignored by Git. Without environment overrides or a `.env` file, the framework defaults to `PLATFORM=api`, `ENV=dev`, and `TAGS=@api`. The current feature is tagged `@web`, so those defaults do not select it.

## Environment configuration

Configuration is read from environment variables and the root `.env` file in `tests/configs/run.config.ts`. Variables set in the shell take precedence over `.env` values.

| Variable | Supported values | Default | Purpose |
| --- | --- | --- | --- |
| `PLATFORM` | `web`, `api` | `api` | Selects the base URL configuration. |
| `ENV` | `dev`, `stg`, `qa` | `dev` | Selects the target environment. |
| `TAGS` | Gherkin tag expression | `@api` | Selects scenarios to generate and run. |

Base URLs are defined in `tests/configs/env.config.ts`. The web URL is currently `https://shop.qaautomationlabs.com`; the API URL is `https://api.qaautomationlabs.com/`. Each platform currently uses the same URL for all three environments.

`PLATFORM` selects the URL; `TAGS` selects the scenarios. Set both when switching between web and API tests.

## Test commands

`npm test` generates Playwright tests with `bddgen`, then runs them in Chromium.

```sh
# Run the web login scenarios with environment overrides (macOS/Linux).
PLATFORM=web ENV=dev TAGS="@web and @login" npm test

# Run one tagged scenario.
PLATFORM=web ENV=qa TAGS="@TES-001" npm test

# Generate tests and list them without launching a browser.
PLATFORM=web ENV=dev TAGS=@web npx bddgen
PLATFORM=web ENV=dev TAGS=@web npx playwright test --list

# Check code quality.
npm run lint
npx tsc --noEmit
```

Use the `.env` file for the same configuration on Windows. When running `npx playwright test` directly, generate the tests first after changing features, steps, or tag filters.

Local runs open Chromium with one worker. When `CI` is set, runs are headless, use two workers, and retry failed tests once. Traces are collected on the first retry.

## Project structure

```text
tests/
  configs/
    env.config.ts              # Platform and environment URLs
    run.config.ts              # Environment variables and defaults
  core/
    configReader.ts            # Reads the selected configuration
    fixtures.ts                # Factory fixture and BDD functions
    web/
      basePage.ts              # Shared Playwright Page reference
      webPageFactory.ts        # Creates and caches POM instances
  web/
    shared/
      features/
        login.feature          # Gherkin scenarios
      stepDefs/
        loginSteps.web.ts      # Connects Gherkin steps to POM methods
      pageObjects/
        login.pom.ts           # Login locators, actions, and assertions
playwright.config.ts           # BDD discovery and browser settings
reporting-labs.config.ts       # Report settings
```

## Writing tests

The execution flow is:

```text
Feature file → Step definition → WebPageFactory → POM method
```

Feature files describe test scenarios. Step definitions register `Given`, `When`, `Then`, or `Step` functions imported from `tests/core/fixtures.ts` and delegate to POM methods:

```ts
import { Given, Step } from "../../../core/fixtures";

Given("user launches the web app", async ({ webPageFactory }) => {
    await webPageFactory.getLoginPage().open();
});

Step("user verifies the login page", async ({ webPageFactory }) => {
    await webPageFactory.getLoginPage().verifyLoginPage();
});
```

POM classes extend `BasePage`, which holds the Playwright `Page`. Keep locators, browser actions, and page assertions in the POM. `WebPageFactory` passes the same scenario's `Page` into each POM and caches its instance. Scenarios receive separate factories.

To add a test:

1. Add a `.feature` file under `tests/<platform>/<domain>/features/` and tag it appropriately.
2. Add the corresponding step definitions under `stepDefs/`.
3. Add or extend a POM under `pageObjects/`.
4. Add a typed factory method to `WebPageFactory` when introducing a new web POM.

The current BDD patterns discover `.feature` files directly inside `features/` folders and `.ts` files directly inside `stepDefs/` folders. Keep new files at those levels or update the patterns in `playwright.config.ts`.

Use camelCase names and match file-name capitalization in imports. Keep required extensions and suffixes, such as `.feature`, `.pom.ts`, and `.web.ts`.

## VS Code navigation

Install [Cucumber (Gherkin) Full Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete), extension ID `alexkrechik.cucumberautocomplete`.

Add these settings to `.vscode/settings.json`, preserving your other editor settings:

```json
{
  "files.associations": {
    "*.feature": "feature"
  },
  "cucumberautocomplete.steps": ["tests/**/stepDefs/**/*.ts"],
  "cucumberautocomplete.syncfeatures": "tests/**/features/**/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.strictGherkinValidation": false
}
```

Reload VS Code, then Cmd+click on macOS or Ctrl+click on Windows/Linux to navigate from a feature step to its definition. This extension recognizes `Step(...)` as well as `Given`, `When`, and `Then`. The `.vscode` folder is ignored by Git, so each checkout needs its own settings.

## Reports and CI

Test runs use the console list reporter and Reporting Labs. Open `reporting-labs/index.html` after a run to view the HTML report. Report options are configured in `reporting-labs.config.ts`; generated tests, reports, and test artifacts are ignored by Git.

The GitHub Actions workflow is manually triggered. Its environment input is not currently passed to the test process, and it uploads `playwright-report/` rather than the configured Reporting Labs output. Before using it for web tests, set `PLATFORM`, `ENV`, and `TAGS` in the workflow and update the artifact path to `reporting-labs/`.
