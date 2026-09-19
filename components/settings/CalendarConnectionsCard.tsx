import {
    ActivityIndicator,
    Alert,
    Text,
    View,
} from "react-native";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    Button,
} from "../ui/Button";

import {
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
                                    styles.settingsDescription
                                }
                            >
                                iCloud connection management coming next.
                            </Text>
                        </View>
                    </View>
                </>
            )}
        </View>
    );
}