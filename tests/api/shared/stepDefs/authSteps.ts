import { DataTable } from "playwright-bdd";
import { Given, Then, When } from "../../../core/fixtures";
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

Then("user verifies the response data", ({ world }, dataTable: DataTable) => {
    const expectedData = dataTable.rowsHash();
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
        expect(response.error.status).toBe(Number(expectedData.status));
    }

    if ("error" in response && expectedData.status === "422") {
        console.log("Response error details:", response.error.details);
        const details = response.error.details ?? [];
        const emailError = details.find(detail => detail.field === "email")?.message;
        const passwordError = details.find(detail => detail.field === "password")?.message;

        if (expectedData.emailField) {
            console.log("Email error message:", emailError);
            expect(emailError).toBe(expectedData.emailField);
        }
        if (expectedData.passwordField) {
            console.log("Password error message:", passwordError);
            expect(passwordError).toBe(expectedData.passwordField);
        }
    }
});
