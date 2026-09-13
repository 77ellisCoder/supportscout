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
} from "../services/auth/AuthService";

import {
    AuthStorage,
} from "../services/storage/AuthStorage";

type AuthContextValue = {
    user: AuthUser | null;

    token: string | null;

    isLoading: boolean;

    isAuthenticated: boolean;

    login: (
        email: string,
        password: string
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

    const logout =
        useCallback(
            async () => {
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

                logout,
            }),
            [
                user,
                token,
                isLoading,
                login,
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