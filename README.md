# Playwright BDD Framework

TypeScript test framework using Playwright, Gherkin feature files, page objects, and API services. Step definitions access POMs through `webPageFactory` and API services through `serviceFactory`.

The current web scenario opens the shop and verifies its login page. Credential entry and login submission are commented out in the feature file and are not implemented yet.

## Project setup

Use Node.js 24 and npm. Run the following commands from the project root:

```sh
npm ci
npx playwright install chromium
```

Create a `.env` file in the project root to select the suite, environment, and scenarios:

```dotenv
PLATFORM=api
ENV=dev
TAGS=@API-001
```

Then run:

```sh
npm test
```

The `.env` file is ignored by Git. Without overrides, the framework defaults to `PLATFORM=api`, `ENV=dev`, and no tag filter. Set `PLATFORM=web` and `TAGS=@web` to run UI tests using the same `npm test` command.

## Environment configuration

Configuration is read from environment variables and the root `.env` file in `tests/configs/run.config.ts`. Variables set in the shell take precedence over `.env` values.

| Variable | Supported values | Default | Purpose |
| --- | --- | --- | --- |
| `PLATFORM` | `web`, `api` | `api` | Selects the UI or API project. |
| `ENV` | `dev`, `stg`, `qa` | `dev` | Selects the target environment. |
| `TAGS` | Gherkin tag expression | No filter | Selects scenarios to generate and run. |

Base URLs are defined in `tests/configs/env.config.ts`. The web URL is currently `https://shop.qaautomationlabs.com`; the API URL is `https://api.qaautomationlabs.com/v1/`. Each platform currently uses the same URL for all three environments.

`PLATFORM` enables only the corresponding Playwright project: `api` uses `tests/api/`; `web` enables `web-chromium` and uses `tests/web/`. `ENV` selects that platform's base URL, and `TAGS` filters its scenarios. Keep the tags consistent with the selected platform.

If no tests are selected, the error includes the active platform, environment, tags, and feature path. For example, `PLATFORM=web` with `TAGS=@API-001` selects no scenarios because that tag belongs to an API feature. Correct the platform or tags in `.env`; use an empty `TAGS` value to select all scenarios for the chosen platform. CLI filters such as `--grep` can also exclude every test.

## Test commands

Each test command generates Playwright tests with `bddgen`, then runs the selected project. API steps use the `request` fixture without launching a browser; web steps use Chromium.

```sh
# Run the suite selected in .env.
npm test

# Run one API scenario (macOS/Linux).
PLATFORM=api TAGS="@API-001" npm test

# Run the web login scenarios.
PLATFORM=web ENV=dev TAGS="@web and @login" npm test

# Run one tagged scenario.
PLATFORM=web ENV=qa TAGS="@TES-001" npm test

# Run all API scenarios, ignoring a tag filter from .env.
PLATFORM=api TAGS="" npm test

# Generate tests and list them without launching a browser.
npx bddgen
npx playwright test --list

# Check code quality.
npm run lint
npx tsc --noEmit
```

Use the `.env` file for the same configuration on Windows. When running `npx playwright test` directly, generate the tests first after changing features, steps, or tag filters.

Local web runs open Chromium with one worker. API runs use one worker without a browser. When `CI` is set, web runs are headless, all runs use two workers, and failed tests retry once. Traces are collected on the first retry.

## Project structure

```text
tests/
  configs/
    env.config.ts              # Platform and environment URLs
    run.config.ts              # Environment variables and defaults
  core/
    configReader.ts            # Reads the selected configuration
    fixtures.ts                # Web/API factory fixtures and BDD functions
    api/
      baseRequest.ts           # Shared APIRequestContext reference
      serviceFactory.ts        # Creates and caches API services
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
playwright.config.ts           # Separate API and web BDD projects
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

API services extend `BaseRequest`, which holds Playwright's `APIRequestContext`. API steps receive `serviceFactory` and access services with methods such as `serviceFactory.getAuthService()`. The factory caches services within each scenario and uses the built-in `request` fixture, so Playwright manages request-context cleanup. API steps that only request `serviceFactory` or `request` do not initialize a browser. The current `@API-001` scenario sends a GET request to the API base URL and expects HTTP 200. Use endpoint paths without a leading slash to preserve the `/v1/` base URL prefix.

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

Test runs use the console list reporter and Reporting Labs. Automatic report opening is disabled, including after failures. Open `reporting-labs/index.html` manually to view the HTML report. Report options are configured in `reporting-labs.config.ts`; generated tests, reports, and test artifacts are ignored by Git.

The GitHub Actions workflow is manually triggered. Its environment input is not currently passed to the test process, and it uploads `playwright-report/` rather than the configured Reporting Labs output. Set `PLATFORM`, `ENV`, and optional `TAGS` in the workflow and update the artifact path to `reporting-labs/`.
