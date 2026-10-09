import { APIResponse, expect, type APIRequestContext } from "@playwright/test";
import { BaseRequest } from "../../../core/api/baseRequest";

type recordType = Record<string, string>;

export class AuthService extends BaseRequest {
    constructor(request: APIRequestContext) {
        super(request);
    }

    async verifyApiIsAvailable(): Promise<void> {
        const response = await this.request.get("/");
        expect(response.status()).toBe(200);
    }

    async sendPostRequestForLogin(endpoint: string, payload: recordType): Promise<APIResponse> {
        const response = await this.request.post(endpoint, {
            data: payload,
        });
        return response;
    }
}
