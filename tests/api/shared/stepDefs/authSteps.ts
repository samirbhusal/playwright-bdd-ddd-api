import { DataTable } from "playwright-bdd";
import { Given, Step, Then, When } from "../../../core/fixtures";
import { expect } from "@playwright/test";
import { AuthLoginErrorResponse, AuthLoginResponse } from "../../utils/apiTypes";

Given("user launches the api services", async ({ serviceFactory }) => {
    await serviceFactory.getAuthService().verifyApiIsAvailable();
});

When("user sends POST request to {string} with {word} credentials", async ({ serviceFactory, world }, endpoint: string, _credentialsType: string, dataTable: DataTable) => {
    const credentials = dataTable.rowsHash();
    const res = await serviceFactory.getAuthService().sendPostRequestForLogin(endpoint, credentials);
    world.statusCode = res.status();
    world.apiResponse = await res.json() as AuthLoginResponse | AuthLoginErrorResponse;
});


Then("response status code should be {int}", ({ world }, statusCode: number) => {
    expect(world.statusCode).toBe(statusCode);
});

Step("user verifies the response data", ({ world }, dataTable: DataTable) => {
    const expectedData = dataTable.rowsHash();
    const expectedStatusCode = world.statusCode?.toString() ?? "";
    const response = world.apiResponse;

    // Add your assertion logic here
    if (!response) {
        throw new Error("API response is missing");
    }

    expect(response).toBeDefined();
    if ("data" in response) {
        expect(response.data.user.email).toBe(expectedData.email);
        expect(response.data.user.name).toBe(expectedData.name);
        expect(response.data.user.role).toBe(expectedData.role);
    }

    if ("error" in response) {
        expect(response.error.code).toBe(expectedData.code);
        expect(response.error.message).toContain(expectedData.message);

    }

    if ("error" in response && expectedStatusCode === "422") {
        const details = response.error.details ?? [];
        const emailError = details.find(detail => detail.field === "email")?.message;
        const passwordError = details.find(detail => detail.field === "password")?.message;

        if (expectedData.emailField) {
            expect(emailError).toBe(expectedData.emailField);
        }
        if (expectedData.passwordField) {
            expect(passwordError).toBe(expectedData.passwordField);
        }
    }
});
