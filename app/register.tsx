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
    bootstrapSync,
} from "../services/sync/BootstrapSyncService";

import {
    styles,
} from "../styles/login.styles";

export default function RegisterScreen() {
    const {
        register,
    } = useAuth();

    const [
        displayName,
        setDisplayName,
    ] =
        useState("");

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
        confirmPassword,
        setConfirmPassword,
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

    async function handleRegister() {
        const normalizedEmail =
            email.trim();

        const normalizedName =
            displayName.trim();

        if (
            !normalizedName ||
            !normalizedEmail ||
            !password ||
            !confirmPassword
        ) {
            setError(
                "Complete all fields."
            );

            return;
        }

        if (
            password.length < 8
        ) {
            setError(
                "Password must be at least 8 characters."
            );

            return;
        }

        if (
            password !==
            confirmPassword
        ) {
            setError(
                "Passwords do not match."
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
            await register(
                normalizedEmail,
                password,
                normalizedName
            );

            await bootstrapSync();

            router.replace(
                "/"
            );
        } catch (
        registerError
        ) {
            setError(
                registerError instanceof
                    Error
                    ? registerError.message
                    : "Unable to create account"
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
                        Create your account.
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
                            NAME
                        </Text>

                        <TextInput
                            value={
                                displayName
                            }
                            onChangeText={
                                setDisplayName
                            }
                            autoCapitalize="words"
                            autoComplete="name"
                            placeholder="Your name"
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
                            autoComplete="new-password"
                            placeholder="At least 8 characters"
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
                            CONFIRM PASSWORD
                        </Text>

                        <TextInput
                            value={
                                confirmPassword
                            }
                            onChangeText={
                                setConfirmPassword
                            }
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={
                                false
                            }
                            autoComplete="new-password"
                            placeholder="Repeat password"
                            placeholderTextColor="#746d7d"
                            style={
                                styles.input
                            }
                            onSubmitEditing={
                                handleRegister
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
                        title="Create account"
                        onPress={
                            handleRegister
                        }
                        loading={
                            isSubmitting
                        }
                        fullWidth
                    />

                    <Button
                        title="Back to sign in"
                        variant="secondary"
                        disabled={
                            isSubmitting
                        }
                        onPress={() =>
                            router.replace(
                                "/login"
                            )
                        }
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
}