import { expect, type APIRequestContext } from "@playwright/test";
import { BaseRequest } from "../../../core/api/baseRequest";

export class AuthService extends BaseRequest {
    constructor(request: APIRequestContext) {
        super(request);
    }

    async verifyApiIsAvailable(): Promise<void> {
        const response = await this.request.get("");
        expect(response.status()).toBe(200);
    }
}
