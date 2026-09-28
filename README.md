# Playwright BDD tests

This project uses Playwright and feature files for browser and API tests. It is still being set up; there are no feature files or step definitions yet.

## Set up

```sh
npm ci
npx playwright install chromium
```

## Add tests

Put feature files in a `features` folder under `tests`, and their TypeScript step definitions in a `steps` folder. For example:

```text
tests/
  api/
    features/
      users.feature
    steps/
      users.ts
```

The default tag filter is `@api`, so add `@api` to features or scenarios you want to run.

## Run

```sh
npm test
npm run lint
```

`npm test` generates the Playwright tests from feature files, then runs them in Chromium. The default environment is `dev`, with its base URL set in `tests/configs/env.config.ts`.
