import { type Page } from "@playwright/test";
import { LoginPage } from "../../web/shared/pageObjects/login.pom";

/** Owns the page objects for one scenario; never share across tests. */
export class WebPageFactory {
    private loginPage?: LoginPage;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getLoginPage(): LoginPage {
        if (!this.loginPage) {
            this.loginPage = new LoginPage(this.page);
        }

        return this.loginPage;
    }
}
