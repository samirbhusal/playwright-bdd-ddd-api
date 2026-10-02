# Playwright BDD tests

This project uses Playwright and feature files for browser and API tests. The web login scenario is being set up; only its launch step is implemented so far.

## Web page objects and step definitions

Each POM extends `BasePage`, which holds a protected, readonly Playwright `page`. Keep locators, browser actions, and page-specific behavior in the POM.

`WebPageFactory` lazily creates and caches POMs. The `webPageFactory` fixture creates one factory per scenario, so steps in that scenario share the same POM instances while parallel scenarios remain isolated.

Feature files describe scenarios. Step definition files register Playwright-style `Given`, `When`, and `Then` functions imported from `tests/core/fixtures.ts`. Locators, browser actions, and page assertions belong in POMs.

Each step receives `webPageFactory` directly from the fixture and calls a POM method:

```ts
Given("user launches the web app", async ({ webPageFactory }) => {
    await webPageFactory.getLoginPage().open();
});
```

To add a POM, extend `BasePage`, pass `page` to `super(page)`, and add a typed method to `WebPageFactory` that creates and caches the POM. To add a step, register a function in the corresponding step definition file and call its POM method. The BDD configuration includes the fixture file and step definition files in its `steps` patterns.

## Set up

```sh
npm ci
npx playwright install chromium
```

## Add tests

Put feature files in a `features` folder under `tests`, and their TypeScript step definitions in a `stepDefs` folder. For example:

```text
tests/
  api/
    features/
      login.feature
      shoppingCart.feature
    stepDefs/
      login.ts
      shoppingCart.ts
```

The default tag filter is `@api`, so add `@api` to features or scenarios you want to run.

### Naming

Use camelCase for project-owned files and directories. For example, use `shoppingCart.feature`, `shoppingCart.ts`, `configReader.ts`, and `pageObjects/`. Keep required names and suffixes such as `package.json`, `playwright.config.ts`, and `.feature` as they are. Match the capitalization of file and directory names exactly in imports and configuration paths.

## Run

```sh
npm test
npm run lint
```

`npm test` generates the Playwright tests from feature files, then runs them in Chromium. The default environment is `dev`, with its base URL set in `tests/configs/env.config.ts`.
