import { expect, Locator, type Page } from "@playwright/test";
import { BasePage } from "../../../core/web/basePage";

export class LoginPage extends BasePage {
    private readonly signInHeading: Locator;
    constructor(page: Page) {
        super(page);
        this.signInHeading = page.getByRole("heading", { name: "Sign in" });
    }

    async open(): Promise<void> {
        await this.page.goto("/");
    }

    async verifyLoginPage(): Promise<void> {
        await expect(this.page).toHaveURL("https://shop.qaautomationlabs.com");
        await expect(this.signInHeading).toBeVisible();
    }
}
