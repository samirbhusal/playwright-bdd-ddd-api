export interface AuthLoginResponse {
    data: {
        tokenType: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        user: {
            id: number;
            email: string;
            name: string;
            role: string;
        };
    };
    meta: {
        requestId: string;
        responseTimeMs: number;
        timestamp: string;
        apiVersion: string;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthLoginErrorResponse {
    error: {
        details?: Array<{
            field: string;
            message: string;
        }>;
        code: string;
        message: string;
        status: number;
    };
    meta: {
        requestId: string;
        responseTimeMs: number;
        timestamp: string;
        apiVersion: string;
    };
}
