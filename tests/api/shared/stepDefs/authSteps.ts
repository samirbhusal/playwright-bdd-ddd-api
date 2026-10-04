import { DataTable } from "playwright-bdd";
import { Given, Then, When } from "../../../core/fixtures";
import { expect } from "@playwright/test";

Given("user launches the api services", async ({ serviceFactory }) => {
    await serviceFactory.getAuthService().verifyApiIsAvailable();
});

When("user sends POST request to {string} with valid credentials", async ({ serviceFactory, world }, endpoint: string, dataTable: DataTable) => {
    const credentials = dataTable.rowsHash();
    const res = await serviceFactory.getAuthService().sendPostRequestForLogin(endpoint, credentials);
    world.apiResponse = res;
});

Then("user verifies the response data", ({ world }) => {
    const response = world.apiResponse;
    // Add your assertion logic here

    if (!response) {
        throw new Error("API response is missing");
    }

    expect(response).toBeDefined();
    expect(response.data.tokenType).toBe("Bearer");
    expect(response.data.accessToken).toBeDefined();
    expect(response.data.refreshToken).toBeDefined();
    expect(response.data.expiresIn).toBeGreaterThan(0);
});

