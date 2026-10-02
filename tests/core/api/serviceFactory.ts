import { type APIRequestContext } from "@playwright/test";
import { AuthService } from "../../api/shared/services/auth.service";

export class ServiceFactory {
    private authService?: AuthService;
    private readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    getAuthService(): AuthService {
        if (!this.authService) {
            this.authService = new AuthService(this.request);
        }

        return this.authService;
    }
}
