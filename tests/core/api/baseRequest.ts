import { type APIRequestContext } from "@playwright/test";

export abstract class BaseRequest {
    protected readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }
}
