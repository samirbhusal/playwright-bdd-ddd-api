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