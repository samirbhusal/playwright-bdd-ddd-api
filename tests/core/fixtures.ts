import { test as base, createBdd } from "playwright-bdd";
import { ServiceFactory } from "./api/serviceFactory";
import { WebPageFactory } from "./web/webPageFactory";
import { World } from "./world";

export type TestFixtures = {
    webPageFactory: WebPageFactory;
    serviceFactory: ServiceFactory;
    world: World;
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

    // eslint-disable-next-line no-empty-pattern
    world: async ({ }, use) => {
        await use({});
    },
});

export const { Given, When, Then, Step } = createBdd(test);
