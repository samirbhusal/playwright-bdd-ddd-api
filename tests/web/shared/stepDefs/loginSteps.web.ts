import { Given, Step } from "../../../core/fixtures";

Given("user launches the web app", async ({ webPageFactory }) => {
    await webPageFactory.getLoginPage().open();
});

Step("user verifies the login page", async ({ webPageFactory }) => {
    await webPageFactory.getLoginPage().verifyLoginPage();
});
