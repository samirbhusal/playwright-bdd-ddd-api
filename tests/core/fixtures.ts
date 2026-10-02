import { test as base, createBdd } from "playwright-bdd";
import { ServiceFactory } from "./api/serviceFactory";
import { WebPageFactory } from "./web/webPageFactory";

export type TestFixtures = {
    webPageFactory: WebPageFactory;
    serviceFactory: ServiceFactory;
};

export const test = base.extend<TestFixtures>({
    webPageFactory: async ({ page }, use) => {
        const webPageFactory = new WebPageFactory(page);
        await use(webPageFactory);
    },
    serviceFactory: async ({ request }, use) => {
        const serviceFactory = new ServiceFactory(request);
        await use(serviceFactory);
    },
});

export const { Given, When, Then, Step } = createBdd(test);
