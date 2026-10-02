import { Given } from "../../../core/fixtures";

Given("user launches the api services", async ({ serviceFactory }) => {
    await serviceFactory.getAuthService().verifyRequestContext();
});
