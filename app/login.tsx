import {
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

export default function LoginScreen() {
    const {
        login,
    } =
        useAuth();

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
            await login(
                email.trim(),
                password
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
                </View>
            </View>
        </View>
    );
}