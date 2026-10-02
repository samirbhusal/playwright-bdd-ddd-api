import { test as base, createBdd } from "playwright-bdd";
import { WebPageFactory } from "./web/webPageFactory";

export type WebFixtures = {
    webPageFactory: WebPageFactory;
};

export const test = base.extend<WebFixtures>({
    webPageFactory: async ({ page }, use) => {
        const webPageFactory = new WebPageFactory(page);
        await use(webPageFactory);
    },
});

export const { Given, When, Then, Step } = createBdd(test);
