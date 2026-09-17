import {
    useEffect,
    useState,
} from "react";

import {
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
} from "expo-router";

import {
    Button,
} from "../components/ui/Button";

import {
    useAuth,
} from "../hooks/useAuth";

import {
    styles,
} from "../styles/login.styles";

import {
    bootstrapSync,
} from "../services/sync/BootstrapSyncService";

import * as AuthSession
    from "expo-auth-session";

import * as WebBrowser
    from "expo-web-browser";

import {
    GOOGLE_CLIENT_ID,
} from "../config/environment";

WebBrowser.maybeCompleteAuthSession();

const googleDiscovery = {
    authorizationEndpoint:
        "https://accounts.google.com/o/oauth2/v2/auth",

    tokenEndpoint:
        "https://oauth2.googleapis.com/token",

    revocationEndpoint:
        "https://oauth2.googleapis.com/revoke",
};


export default function LoginScreen() {
    const {
        login,
        googleLogin,
    } = useAuth();

    const [
        email,
        setEmail,
    ] =
        useState("");

    const [
        password,
        setPassword,
    ] =
        useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState<
            string | null
        >(null);

    const redirectUri =
        AuthSession.makeRedirectUri({
            scheme:
                "supportscout",
        });

    const [
        googleNonce,
    ] =
        useState(
            () =>
                Math.random()
                    .toString(36)
                    .substring(2)
        );

    const [
        googleRequest,
        googleResponse,
        promptGoogleLogin,
    ] =
        AuthSession.useAuthRequest(
            {
                clientId:
                    GOOGLE_CLIENT_ID,

                redirectUri,

                scopes: [
                    "openid",
                    "profile",
                    "email",
                ],

                responseType:
                    AuthSession
                        .ResponseType
                        .IdToken,

                usePKCE:
                    false,

                extraParams: {
                    nonce:
                        googleNonce,
                },
            },
            googleDiscovery
        );

    useEffect(
        () => {
            if (
                googleResponse?.type !==
                "success"
            ) {
                return;
            }

            const idToken =
                googleResponse
                    .params
                    .id_token;

            if (!idToken) {
                setError(
                    "Google did not return an ID token."
                );

                return;
            }

            void handleGoogleLogin(
                idToken
            );
        },
        [
            googleResponse,
        ]
    );

    async function handleGoogleLogin(
        idToken: string
    ) {
        try {
            setError(
                null
            );

            setIsSubmitting(
                true
            );

            await googleLogin(
                idToken
            );

            console.log(
                "GOOGLE: authentication complete"
            );

            console.log(
                "GOOGLE: starting bootstrap"
            );

            await bootstrapSync();

            console.log(
                "GOOGLE: bootstrap complete"
            );

            router.replace(
                "/"
            );
        } catch (
        error
        ) {
            console.error(
                "Google login failed:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Google login failed"
            );
        } finally {
            setIsSubmitting(
                false
            );
        }
    }

    async function handleLogin() {
        if (
            !email.trim() ||
            !password
        ) {
            setError(
                "Enter your email and password."
            );

            return;
        }

        setError(
            null
        );

        setIsSubmitting(
            true
        );

        try {
            console.log(
                "LOGIN: starting authentication"
            );

            await login(
                email.trim(),
                password
            );

            console.log(
                "LOGIN: authentication complete"
            );

            console.log(
                "LOGIN: starting bootstrap"
            );

            await bootstrapSync();

            console.log(
                "LOGIN: bootstrap complete"
            );

            router.replace(
                "/"
            );
        } catch (
        loginError
        ) {
            setError(
                loginError instanceof
                    Error
                    ? loginError.message
                    : "Unable to log in"
            );
        } finally {
            setIsSubmitting(
                false
            );
        }
    }

    return (
        <View
            style={
                styles.container
            }
        >
            <View
                style={
                    styles.card
                }
            >
                <View
                    style={
                        styles.heading
                    }
                >
                    <Text
                        style={
                            styles.title
                        }
                    >
                        SupportScout
                    </Text>

                    <Text
                        style={
                            styles.subtitle
                        }
                    >
                        Sign in to continue.
                    </Text>
                </View>

                <View
                    style={
                        styles.form
                    }
                >
                    <View
                        style={
                            styles.field
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            EMAIL
                        </Text>

                        <TextInput
                            value={
                                email
                            }

                            onChangeText={
                                setEmail
                            }

                            autoCapitalize="none"

                            autoCorrect={
                                false
                            }

                            keyboardType="email-address"

                            autoComplete="email"

                            placeholder="you@example.com"

                            placeholderTextColor="#746d7d"

                            style={
                                styles.input
                            }
                        />
                    </View>

                    <View
                        style={
                            styles.field
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            PASSWORD
                        </Text>

                        <TextInput
                            value={
                                password
                            }

                            onChangeText={
                                setPassword
                            }

                            secureTextEntry

                            autoCapitalize="none"

                            autoCorrect={
                                false
                            }

                            autoComplete="current-password"

                            placeholder="Password"

                            placeholderTextColor="#746d7d"

                            style={
                                styles.input
                            }

                            onSubmitEditing={
                                handleLogin
                            }
                        />
                    </View>

                    {error && (
                        <Text
                            style={
                                styles.error
                            }
                        >
                            {error}
                        </Text>
                    )}

                    <Button
                        title="Sign in"

                        onPress={
                            handleLogin
                        }

                        loading={
                            isSubmitting
                        }

                        fullWidth
                    />

                    <Button
                        title="Create account"
                        variant="secondary"
                        disabled={
                            isSubmitting
                        }
                        onPress={() =>
                            router.push(
                                "/register"
                            )
                        }
                        fullWidth
                    />

                    <View
                        style={{
                            flexDirection:
                                "row",

                            alignItems:
                                "center",

                            marginVertical:
                                18,
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor:
                                    "#444",
                            }}
                        />

                        <Text
                            style={{
                                color: "#A7A7B3",

                                marginHorizontal:
                                    12,

                                opacity:
                                    0.6,
                            }}
                        >
                            OR
                        </Text>

                        <View
                            style={{
                                flex: 1,
                                height: 1,
                                backgroundColor:
                                    "#444",
                            }}
                        />
                    </View>

                    <Button
                        title="Continue with Google"
                        variant="secondary"
                        disabled={
                            !googleRequest ||
                            isSubmitting
                        }
                        loading={
                            isSubmitting
                        }
                        onPress={() =>
                            promptGoogleLogin()
                        }
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
}