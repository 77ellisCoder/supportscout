import {
    Platform,
} from "react-native";

import * as SecureStore from "expo-secure-store";

const TOKEN_KEY =
    "supportscout_auth_token";

export const AuthStorage = {
    async getToken():
        Promise<string | null> {
        if (
            Platform.OS ===
            "web"
        ) {
            return (
                globalThis
                    .localStorage
                    ?.getItem(
                        TOKEN_KEY
                    ) ??
                null
            );
        }

        return SecureStore.getItemAsync(
            TOKEN_KEY
        );
    },

    async setToken(
        token: string
    ): Promise<void> {
        if (
            Platform.OS ===
            "web"
        ) {
            globalThis
                .localStorage
                ?.setItem(
                    TOKEN_KEY,
                    token
                );

            return;
        }

        await SecureStore.setItemAsync(
            TOKEN_KEY,
            token
        );
    },

    async clearToken():
        Promise<void> {
        if (
            Platform.OS ===
            "web"
        ) {
            globalThis
                .localStorage
                ?.removeItem(
                    TOKEN_KEY
                );

            return;
        }

        await SecureStore.deleteItemAsync(
            TOKEN_KEY
        );
    },
};