# Playwright BDD Framework

Automated UI and API tests using Playwright and TypeScript. Feature files define the steps; page objects and API services perform the actions and checks.

## Setup

Use Node.js 24 and npm. From the project root:

```sh
npm ci
npx playwright install chromium # Required for UI tests only
```

Create `.env` beside `package.json`:

```dotenv
PLATFORM=api
ENV=dev
TAGS=@API-001
```

Run:

```sh
npm test
```

## Configuration

| Setting | Purpose | Values | Default |
| --- | --- | --- | --- |
| `PLATFORM` | Select API or UI tests | `api`, `web` | `api` |
| `ENV` | Select the environment | `dev`, `stg`, `qa` | `dev` |
| `TAGS` | Select labeled scenarios | `@API-001`, `@web`, or a tag expression | All scenarios for the selected platform |

| Test selection | `PLATFORM` | `TAGS` |
| --- | --- | --- |
| API availability | `api` | `@API-001` |
| All API tests | `api` | `@api` |
| Login page | `web` | `@TES-001` |
| All UI tests | `web` | `@web` |
| Web login tests | `web` | `@web and @login` |

Tags are case-sensitive. Set `TAGS=` to select all scenarios for the chosen platform. Shell variables override `.env`; `.env` is ignored by Git.

URLs are configured in [`tests/configs/env.config.ts`](tests/configs/env.config.ts). All three environments currently use the same URLs:

- API: `https://api.qaautomationlabs.com/v1`
- Web: `https://shop.qaautomationlabs.com`

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Generate and run tests selected in `.env` |
| `npm test -- --list` | List selected tests without running them |
| `npm run lint` | Check code style and common mistakes |
| `npx tsc --noEmit` | Check TypeScript types |

`npm test` runs `bddgen` followed by Playwright. Generated tests are stored in `.features-gen/`; do not edit them.

## Test flow

```text
UI:  Feature → Step definition → WebPageFactory → POM
API: Feature → Step definition → ServiceFactory → API service
```

- **Features** contain scenarios written with `Given`, `When`, `Then`, and `And`.
- **Step definitions** connect feature sentences to POM or service methods.
- **POMs** contain page locators, browser actions, and checks. They extend `BasePage`, which holds the browser page.
- **API services** contain requests and response checks. They extend `BaseRequest`, which holds the request client.
- **Factories** create objects when needed and reuse them within one scenario.
- **Fixtures** supply `webPageFactory` and `serviceFactory`. Steps import `Given`, `When`, `Then`, or `Step` from `tests/core/fixtures.ts`.

`PLATFORM=api` runs the API project without launching a browser. `PLATFORM=web` runs the Chromium project.

Current tests:

- `@API-001`: `verifyApiIsAvailable()` sends a GET request to the API URL and expects HTTP 200.
- `@TES-001`: opens the shop and checks the **Sign in** heading. Credential entry and login submission are not implemented.

## Project files

| Location | Contents |
| --- | --- |
| `tests/api/shared/features/` | API scenarios |
| `tests/api/shared/stepDefs/` | API step definitions |
| `tests/api/shared/services/` | API requests and checks |
| `tests/web/shared/features/` | UI scenarios |
| `tests/web/shared/stepDefs/` | UI step definitions |
| `tests/web/shared/pageObjects/` | Page locators, actions, and checks |
| `tests/core/api/` | `BaseRequest` and `ServiceFactory` |
| `tests/core/web/` | `BasePage` and `WebPageFactory` |
| `tests/core/fixtures.ts` | Factory fixtures and BDD step functions |
| `tests/core/ConfigReader.ts` | Reads platform, environment, tags, and URL |
| `tests/core/selectionErrorReporter.ts` | Shows configuration details when no tests match |
| `tests/configs/` | `.env` loading, defaults, and URLs |
| `playwright.config.ts` | Project selection and test settings |
| `reporting-labs.config.ts` | HTML report settings |

## Add a test

1. Add a scenario and tag to a `.feature` file under `tests/api/` or `tests/web/`.
2. Register its steps in the corresponding `stepDefs/` folder.
3. Add the actions and checks to a POM or API service.
4. Add a factory getter when introducing a new POM or service class.
5. Set `PLATFORM` and `TAGS` in `.env`, then run `npm test`.

Keep feature and step files directly inside `features/` and `stepDefs/` folders. New areas, such as `orders`, can follow the same structure as `shared`.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| No tests found | Match `PLATFORM` and `TAGS`; `@API-001` requires `PLATFORM=api`. Check tag capitalization and CLI filters, or clear `TAGS`. |
| Unsupported platform | Use `api` or `web`. |
| Undefined environment | Use `dev`, `stg`, or `qa` and check `env.config.ts`. |
| Missing browser | Run `npx playwright install chromium` for UI tests. |
| Missing step definition | Match the feature sentence to a registered step in `stepDefs/`. |
| API response is not 200 | Check the configured URL and response details in the report. |

## VS Code navigation

Install [Cucumber (Gherkin) Full Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete). Add to `.vscode/settings.json`:

```json
{
  "files.associations": { "*.feature": "feature" },
  "cucumberautocomplete.steps": ["tests/**/stepDefs/**/*.ts"],
  "cucumberautocomplete.syncfeatures": "tests/**/features/**/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.strictGherkinValidation": false
}
```

Reload VS Code. Cmd+click on macOS or Ctrl+click on Windows/Linux opens a step's definition. `.vscode` is ignored by Git.

## Reports and CI

Open `reporting-labs/index.html` manually after a run. UI failures capture screenshots; traces are collected on the first retry.

Local runs use one worker with a visible UI browser. CI runs use two workers, one retry, and a hidden UI browser.

The manual GitHub Actions workflow still needs its environment input connected to the tests and its report upload path changed from `playwright-report/` to `reporting-labs/`.
