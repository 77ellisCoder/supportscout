import {
    ActivityIndicator,
    Alert,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    useState,
} from "react";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Button,
} from "../ui/Button";

import {
    connectICloudCalendar,
    disconnectCalendar,
    getCalendarConnections,
    startGoogleCalendarConnection,
} from "../../services/calendar/CalendarService";

import {
    styles,
} from "../../styles/settings.styles";

export default function CalendarConnectionsCard() {
    const queryClient =
        useQueryClient();

    const [
        showICloudForm,
        setShowICloudForm,
    ] = useState(false);

    const [
        iCloudEmail,
        setICloudEmail,
    ] = useState("");

    const [
        iCloudPassword,
        setICloudPassword,
    ] = useState("");

    const {
        data:
        connections = [],

        isLoading,

        error,
    } = useQuery({
        queryKey: [
            "calendar-connections",
        ],

        queryFn:
            getCalendarConnections,
    });

    const google =
        connections.find(
            connection =>
                connection.provider ===
                "google"
        );

    const icloud =
        connections.find(
            connection =>
                connection.provider ===
                "icloud"
        );

    const disconnectGoogle =
        useMutation({
            mutationFn: () =>
                disconnectCalendar(
                    "google"
                ),

            onSuccess: async () => {
                await queryClient
                    .invalidateQueries({
                        queryKey: [
                            "calendar-connections",
                        ],
                    });
            },

            onError: (
                mutationError
            ) => {
                Alert.alert(
                    "Unable to disconnect",
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Unable to disconnect Google Calendar."
                );
            },
        });

    const connectICloud =
        useMutation({
            mutationFn: () =>
                connectICloudCalendar(
                    iCloudEmail.trim(),
                    iCloudPassword.trim()
                ),

            onSuccess: async () => {
                setICloudPassword("");
                setShowICloudForm(false);

                await queryClient
                    .invalidateQueries({
                        queryKey: [
                            "calendar-connections",
                        ],
                    });
            },

            onError: (
                mutationError
            ) => {
                Alert.alert(
                    "Unable to connect",
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Unable to connect iCloud Calendar."
                );
            },
        });

    const disconnectICloud =
        useMutation({
            mutationFn: () =>
                disconnectCalendar(
                    "icloud"
                ),

            onSuccess: async () => {
                setICloudEmail("");
                setICloudPassword("");
                setShowICloudForm(false);

                await queryClient
                    .invalidateQueries({
                        queryKey: [
                            "calendar-connections",
                        ],
                    });
            },

            onError: (
                mutationError
            ) => {
                Alert.alert(
                    "Unable to disconnect",
                    mutationError instanceof Error
                        ? mutationError.message
                        : "Unable to disconnect iCloud Calendar."
                );
            },
        });

    async function handleGoogleConnect() {
        try {
            await startGoogleCalendarConnection();
        } catch (
        connectError
        ) {
            Alert.alert(
                "Unable to connect",
                connectError instanceof Error
                    ? connectError.message
                    : "Unable to connect Google Calendar."
            );
        }
    }

    function handleGoogleDisconnect() {
        Alert.alert(
            "Disconnect Google Calendar?",
            "Google Calendar will no longer be included when calculating your availability.",
            [
                {
                    text:
                        "Cancel",

                    style:
                        "cancel",
                },
                {
                    text:
                        "Disconnect",

                    style:
                        "destructive",

                    onPress: () =>
                        disconnectGoogle
                            .mutate(),
                },
            ]
        );
    }

    function handleICloudForm() {
        setICloudEmail(
            icloud?.email ?? ""
        );

        setICloudPassword("");

        setShowICloudForm(
            true
        );
    }

    function handleICloudCancel() {
        setICloudPassword("");

        setShowICloudForm(
            false
        );
    }

    function handleICloudSave() {
        if (
            !iCloudEmail.trim() ||
            !iCloudPassword.trim()
        ) {
            Alert.alert(
                "Missing details",
                "Enter your Apple ID email and app-specific password."
            );

            return;
        }

        connectICloud.mutate();
    }

    function handleICloudDisconnect() {
        Alert.alert(
            "Disconnect iCloud Calendar?",
            "iCloud Calendar will no longer be included when calculating your availability.",
            [
                {
                    text:
                        "Cancel",

                    style:
                        "cancel",
                },
                {
                    text:
                        "Disconnect",

                    style:
                        "destructive",

                    onPress: () =>
                        disconnectICloud
                            .mutate(),
                },
            ]
        );
    }

    return (
        <View
            style={
                styles.calendarCard
            }
        >
            <View
                style={
                    styles.calendarHeader
                }
            >
                <Text
                    style={
                        styles.sectionLabel
                    }
                >
                    CALENDAR CONNECTIONS
                </Text>

                <Text
                    style={
                        styles.settingsDescription
                    }
                >
                    Connect your calendars so SupportScout can include them when calculating band availability.
                </Text>
            </View>

            {isLoading ? (
                <ActivityIndicator />
            ) : error ? (
                <Text
                    style={
                        styles.calendarError
                    }
                >
                    Unable to load calendar connections.
                </Text>
            ) : (
                <>
                    <View
                        style={
                            styles.calendarConnection
                        }
                    >
                        <View
                            style={
                                styles.calendarDetails
                            }
                        >
                            <Text
                                style={
                                    styles.settingsTitle
                                }
                            >
                                Google Calendar
                            </Text>

                            <Text
                                style={
                                    google
                                        ? styles.calendarConnected
                                        : styles.settingsDescription
                                }
                            >
                                {google
                                    ? "Connected"
                                    : "Not connected"}
                            </Text>

                            {google?.email ? (
                                <Text
                                    style={
                                        styles.accountEmail
                                    }
                                >
                                    {google.email}
                                </Text>
                            ) : null}
                        </View>

                        <View
                            style={
                                styles.calendarActions
                            }
                        >
                            <Button
                                title={
                                    google
                                        ? "Reconnect"
                                        : "Connect"
                                }
                                variant="secondary"
                                onPress={
                                    handleGoogleConnect
                                }
                            />

                            {google ? (
                                <Button
                                    title="Disconnect"
                                    variant="secondary"
                                    onPress={
                                        handleGoogleDisconnect
                                    }
                                />
                            ) : null}
                        </View>
                    </View>

                    <View
                        style={
                            styles.calendarDivider
                        }
                    />

                    <View
                        style={
                            styles.calendarProvider
                        }
                    >
                        <View
                            style={
                                styles.calendarConnection
                            }
                        >
                            <View
                                style={
                                    styles.calendarDetails
                                }
                            >
                                <Text
                                    style={
                                        styles.settingsTitle
                                    }
                                >
                                    iCloud Calendar
                                </Text>

                                <Text
                                    style={
                                        icloud
                                            ? styles.calendarConnected
                                            : styles.settingsDescription
                                    }
                                >
                                    {icloud
                                        ? "Connected"
                                        : "Not connected"}
                                </Text>

                                {icloud?.email ? (
                                    <Text
                                        style={
                                            styles.accountEmail
                                        }
                                    >
                                        {icloud.email}
                                    </Text>
                                ) : null}
                            </View>

                            <View
                                style={
                                    styles.calendarActions
                                }
                            >
                                <Button
                                    title={
                                        icloud
                                            ? "Reconnect"
                                            : "Connect"
                                    }
                                    variant="secondary"
                                    onPress={
                                        handleICloudForm
                                    }
                                />

                                {icloud ? (
                                    <Button
                                        title="Disconnect"
                                        variant="secondary"
                                        onPress={
                                            handleICloudDisconnect
                                        }
                                    />
                                ) : null}
                            </View>
                        </View>

                        {showICloudForm ? (
                            <View
                                style={
                                    styles.iCloudForm
                                }
                            >
                                <View
                                    style={
                                        styles.calendarField
                                    }
                                >
                                    <Text
                                        style={
                                            styles.calendarFieldLabel
                                        }
                                    >
                                        Apple ID email
                                    </Text>

                                    <TextInput
                                        value={
                                            iCloudEmail
                                        }
                                        onChangeText={
                                            setICloudEmail
                                        }
                                        autoCapitalize="none"
                                        autoCorrect={
                                            false
                                        }
                                        keyboardType="email-address"
                                        placeholder="you@example.com"
                                        placeholderTextColor="#6f687b"
                                        style={
                                            styles.calendarInput
                                        }
                                    />
                                </View>

                                <View
                                    style={
                                        styles.calendarField
                                    }
                                >
                                    <Text
                                        style={
                                            styles.calendarFieldLabel
                                        }
                                    >
                                        App-specific password
                                    </Text>

                                    <TextInput
                                        value={
                                            iCloudPassword
                                        }
                                        onChangeText={
                                            setICloudPassword
                                        }
                                        autoCapitalize="none"
                                        autoCorrect={
                                            false
                                        }
                                        secureTextEntry
                                        placeholder="xxxx-xxxx-xxxx-xxxx"
                                        placeholderTextColor="#6f687b"
                                        style={
                                            styles.calendarInput
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.calendarFieldHelp
                                        }
                                    >
                                        Use an Apple app-specific password, not your Apple ID password.
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.calendarFormActions
                                    }
                                >
                                    <Button
                                        title="Cancel"
                                        variant="secondary"
                                        onPress={
                                            handleICloudCancel
                                        }
                                    />

                                    <Button
                                        title={
                                            connectICloud.isPending
                                                ? "Connecting..."
                                                : "Save connection"
                                        }
                                        onPress={
                                            handleICloudSave
                                        }
                                        disabled={
                                            connectICloud.isPending
                                        }
                                    />
                                </View>
                            </View>
                        ) : null}
                    </View>
                </>
            )}
        </View>
    );
}