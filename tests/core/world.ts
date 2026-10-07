import { AuthLoginErrorResponse, AuthLoginResponse } from "../api/utils/apiTypes";

export interface World {
    statusCode?: number;
    loginResponseBody?: AuthLoginResponse;
    apiResponse?: AuthLoginResponse | AuthLoginErrorResponse;
}
