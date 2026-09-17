import {
    useState,
} from "react";

import {
    Text,
    TextInput,
    View,
} from "react-native";

import {
    Button,
} from "../../components/ui/Button";

import {
    setPassword,
} from "../../services/auth/AuthService";

import {
    styles,
} from "../../styles/security.styles";

export default function SecurityScreen() {
    const [
        password,
        setPasswordValue,
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
        useState<string | null>(
            null
        );

    const [
        success,
        setSuccess,
    ] =
        useState<string | null>(
            null
        );

    async function handleSetPassword() {
        try {
            setError(null);
            setSuccess(null);

            if (
                password.length <
                8
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

            setIsSubmitting(
                true
            );

            await setPassword(
                password
            );

            setPasswordValue(
                ""
            );

            setConfirmPassword(
                ""
            );

            setSuccess(
                "Password updated."
            );
        } catch (
        error
        ) {
            console.error(
                "Unable to set password:",
                error
            );

            setError(
                error instanceof Error
                    ? error.message
                    : "Unable to set password."
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
                styles.page
            }
        >
            <View
                style={
                    styles.container
                }
            >
                <Text
                    style={
                        styles.heading
                    }
                >
                    Account Security
                </Text>

                <Text
                    style={
                        styles.description
                    }
                >
                    Set or change the password
                    for your SupportScout account.
                </Text>

                <View
                    style={
                        styles.form
                    }
                >
                    <Text
                        style={
                            styles.label
                        }
                    >
                        New password
                    </Text>

                    <TextInput
                        value={
                            password
                        }
                        onChangeText={
                            setPasswordValue
                        }
                        secureTextEntry
                        autoCapitalize="none"
                        autoCorrect={
                            false
                        }
                        placeholder="Enter new password"
                        style={
                            styles.input
                        }
                    />

                    <Text
                        style={
                            styles.label
                        }
                    >
                        Confirm password
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
                        placeholder="Confirm new password"
                        style={
                            styles.input
                        }
                        onSubmitEditing={
                            handleSetPassword
                        }
                    />

                    {error ? (
                        <Text
                            style={
                                styles.error
                            }
                        >
                            {error}
                        </Text>
                    ) : null}

                    {success ? (
                        <Text
                            style={
                                styles.success
                            }
                        >
                            {success}
                        </Text>
                    ) : null}

                    <Button
                        title="Set password"
                        onPress={
                            handleSetPassword
                        }
                        loading={
                            isSubmitting
                        }
                        disabled={
                            isSubmitting
                        }
                        fullWidth
                    />
                </View>
            </View>
        </View>
    );
}