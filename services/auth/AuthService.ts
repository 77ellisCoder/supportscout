import {
    API_URL,
} from "../../config/environment";

import {
    AuthStorage,
} from "../storage/AuthStorage";

export type AuthUser = {
    userId: number;
    email: string;
    displayName: string | null;
};

export type LoginResponse = {
    token: string;
    user: AuthUser;
};

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    const response =
        await fetch(
            `${API_URL}/auth/login`,
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body:
                    JSON.stringify(
                        {
                            email,
                            password,
                        }
                    ),
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body?.error ??
            "Unable to log in"
        );
    }

    return body;
}

export async function googleLogin(
    idToken: string
): Promise<{
    token: string;
    user: AuthUser;
}> {
    const response =
        await fetch(
            `${API_URL}/auth/google`,
            {
                method:
                    "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body:
                    JSON.stringify({
                        idToken,
                    }),
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body?.error ??
            "Unable to log in with Google"
        );
    }

    return body;
}

export async function getCurrentUser(
    token: string
): Promise<AuthUser> {
    const response =
        await fetch(
            `${API_URL}/auth/me`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body?.error ??
            "Unable to load user"
        );
    }

    return body;
}

export async function setPassword(
    password: string
): Promise<void> {
    const token =
        await AuthStorage.getToken();

    if (!token) {
        throw new Error(
            "Authentication required"
        );
    }

    const response =
        await fetch(
            `${API_URL}/auth/password`,
            {
                method:
                    "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`,
                },

                body:
                    JSON.stringify({
                        password,
                    }),
            }
        );

    const body =
        await response.json();

    if (!response.ok) {
        throw new Error(
            body?.error ??
            "Unable to set password"
        );
    }
}