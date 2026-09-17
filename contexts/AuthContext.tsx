import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AuthUser,
    getCurrentUser,
    login as loginRequest,
    googleLogin as googleLoginRequest,
    register as registerRequest,
} from "../services/auth/AuthService";

import {
    AuthStorage,
} from "../services/storage/AuthStorage";

import {
    clearUserScopedData,
} from "../services/sync/UserDataCleanupService";

type AuthContextValue = {
    user: AuthUser | null;

    token: string | null;

    isLoading: boolean;

    isAuthenticated: boolean;

    googleLogin: (
        idToken: string
    ) => Promise<void>;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    register: (
        email: string,
        password: string,
        displayName: string
    ) => Promise<void>;

    logout:
    () => Promise<void>;
};

export const AuthContext =
    createContext<
        AuthContextValue | undefined
    >(undefined);

type Props = {
    children: ReactNode;
};

export function AuthProvider({
    children,
}: Props) {
    const [
        user,
        setUser,
    ] =
        useState<AuthUser | null>(
            null
        );

    const [
        token,
        setToken,
    ] =
        useState<string | null>(
            null
        );

    const [
        isLoading,
        setIsLoading,
    ] =
        useState(true);

    useEffect(() => {
        restoreSession();
    }, []);

    async function restoreSession() {
        try {
            const storedToken =
                await AuthStorage
                    .getToken();

            if (!storedToken) {
                return;
            }

            const currentUser =
                await getCurrentUser(
                    storedToken
                );

            setToken(
                storedToken
            );

            setUser(
                currentUser
            );
        } catch {
            await AuthStorage
                .clearToken();

            setToken(
                null
            );

            setUser(
                null
            );
        } finally {
            setIsLoading(
                false
            );
        }
    }

    const login =
        useCallback(
            async (
                email: string,
                password: string
            ) => {
                const result =
                    await loginRequest(
                        email,
                        password
                    );

                await AuthStorage
                    .setToken(
                        result.token
                    );

                setToken(
                    result.token
                );

                setUser(
                    result.user
                );
            },
            []
        );

    const register =
        useCallback(
            async (
                email: string,
                password: string,
                displayName: string
            ) => {
                const result =
                    await registerRequest(
                        email,
                        password,
                        displayName
                    );

                await AuthStorage
                    .setToken(
                        result.token
                    );

                setToken(
                    result.token
                );

                setUser(
                    result.user
                );
            },
            []
        );

    const googleLogin =
        useCallback(
            async (
                idToken: string
            ) => {
                const result =
                    await googleLoginRequest(
                        idToken
                    );

                await AuthStorage
                    .setToken(
                        result.token
                    );

                setToken(
                    result.token
                );

                setUser(
                    result.user
                );
            },
            []
        );

    const logout =
        useCallback(
            async () => {

                try {
                    await clearUserScopedData();
                } catch (
                error
                ) {
                    console.error(
                        "Unable to clear local user data:",
                        error
                    );
                }

                await AuthStorage
                    .clearToken();

                setToken(
                    null
                );

                setUser(
                    null
                );
            },
            []
        );

    const value =
        useMemo(
            () => ({
                user,

                token,

                isLoading,

                isAuthenticated:
                    Boolean(
                        user &&
                        token
                    ),

                login,

                googleLogin,

                register,

                logout,
            }),
            [
                user,
                token,
                isLoading,
                login,
                googleLogin,
                register,
                logout,
            ]
        );

    return (
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}