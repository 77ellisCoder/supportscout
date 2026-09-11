import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Linking,
    Pressable,
    Text,
    View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import {
    useQueryClient,
} from "@tanstack/react-query";

import {
    startGoogleCalendarConnection,
} from "../../services/calendar/CalendarService";

import {
    useBandAvailability,
    useBandCalendarStatus,
} from "../../hooks/useBandCalendar";

import { colors } from "../../theme";

type Props = {
    bandId: number;
};

function startOfDay(value: Date) {
    const result = new Date(value);
    result.setHours(0, 0, 0, 0);
    return result;
}

function addDays(value: Date, days: number) {
    const result = new Date(value);
    result.setDate(
        result.getDate() + days
    );
    return result;
}

function formatSlot(
    start: string,
    end: string
) {
    return `${new Date(start).toLocaleString(
        "en-AU",
        {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
        }
    )} – ${new Date(end).toLocaleTimeString(
        "en-AU",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    )}`;
}

export function BandAvailabilityCard({
    bandId,
}: Props) {
    const queryClient =
        useQueryClient();

    const [from, setFrom] =
        useState(
            startOfDay(new Date())
        );

    const [to, setTo] =
        useState(
            addDays(
                startOfDay(new Date()),
                14
            )
        );

    const [showFromPicker, setShowFromPicker] =
        useState(false);

    const [showToPicker, setShowToPicker] =
        useState(false);

    const [connecting, setConnecting] =
        useState(false);

    const status =
        useBandCalendarStatus(
            bandId
        );

    const availability =
        useBandAvailability(
            bandId,
            from,
            addDays(to, 1),
            Boolean(
                status.data?.connected
            )
        );

    useEffect(() => {
        const subscription =
            Linking.addEventListener(
                "url",
                ({ url }) => {
                    if (
                        url.startsWith(
                            "supportscout://calendar-connected"
                        )
                    ) {
                        queryClient.invalidateQueries(
                            {
                                queryKey: [
                                    "band",
                                    bandId,
                                    "calendar",
                                ],
                            }
                        );
                    }
                }
            );

        return () =>
            subscription.remove();
    }, [
        bandId,
        queryClient,
    ]);

    const availableSlots =
        useMemo(
            () =>
                availability.data
                    ?.available ?? [],
            [availability.data]
        );

    async function connect() {
        try {
            setConnecting(true);
            await startGoogleCalendarConnection(
                bandId
            );
        } catch (error) {
            console.error(error);
        } finally {
            setConnecting(false);
        }
    }

    return (
        <View
            style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 12,
                backgroundColor:
                    colors.surface,
                gap: 12,
            }}
        >
            <Text
                style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "700",
                }}
            >
                CALENDAR AVAILABILITY
            </Text>

            {!status.data?.connected ? (
                <>
                    <Text
                        style={{
                            color:
                                colors.textSecondary,
                        }}
                    >
                        Connect this band's Google
                        Calendar to use real calendar
                        availability when planning gigs.
                    </Text>

                    <Pressable
                        onPress={connect}
                        disabled={connecting}
                        style={{
                            padding: 12,
                            borderRadius: 8,
                            backgroundColor:
                                colors.primary,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.background,
                                fontWeight: "700",
                                textAlign: "center",
                            }}
                        >
                            {connecting
                                ? "OPENING GOOGLE..."
                                : "CONNECT GOOGLE CALENDAR"}
                        </Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <Text
                        style={{
                            color:
                                colors.textSecondary,
                        }}
                    >
                        Connected
                        {status.data.email
                            ? ` • ${status.data.email}`
                            : ""}
                    </Text>

                    <View
                        style={{
                            flexDirection:
                                "row",
                            gap: 8,
                        }}
                    >
                        <Pressable
                            onPress={() =>
                                setShowFromPicker(
                                    true
                                )
                            }
                            style={{
                                flex: 1,
                                padding: 10,
                                borderWidth: 1,
                                borderColor:
                                    colors.border,
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                    fontSize: 11,
                                }}
                            >
                                FROM
                            </Text>
                            <Text
                                style={{
                                    color:
                                        colors.text,
                                }}
                            >
                                {from.toLocaleDateString(
                                    "en-AU"
                                )}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                setShowToPicker(
                                    true
                                )
                            }
                            style={{
                                flex: 1,
                                padding: 10,
                                borderWidth: 1,
                                borderColor:
                                    colors.border,
                                borderRadius: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                    fontSize: 11,
                                }}
                            >
                                TO
                            </Text>
                            <Text
                                style={{
                                    color:
                                        colors.text,
                                }}
                            >
                                {to.toLocaleDateString(
                                    "en-AU"
                                )}
                            </Text>
                        </Pressable>
                    </View>

                    {showFromPicker && (
                        <DateTimePicker
                            value={from}
                            mode="date"
                            onChange={(_, value) => {
                                setShowFromPicker(
                                    false
                                );
                                if (value)
                                    setFrom(
                                        startOfDay(
                                            value
                                        )
                                    );
                            }}
                        />
                    )}

                    {showToPicker && (
                        <DateTimePicker
                            value={to}
                            mode="date"
                            minimumDate={from}
                            onChange={(_, value) => {
                                setShowToPicker(
                                    false
                                );
                                if (value)
                                    setTo(
                                        startOfDay(
                                            value
                                        )
                                    );
                            }}
                        />
                    )}

                    {availability.isLoading ? (
                        <ActivityIndicator
                            color={
                                colors.primaryLight
                            }
                        />
                    ) : availability.error ? (
                        <Text
                            style={{
                                color: colors.danger,
                            }}
                        >
                            {availability.error.message}
                        </Text>
                    ) : availableSlots.length ===
                      0 ? (
                        <Text
                            style={{
                                color:
                                    colors.textSecondary,
                            }}
                        >
                            No free working-hour slots
                            found for this period.
                        </Text>
                    ) : (
                        <View
                            style={{
                                gap: 8,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                }}
                            >
                                Available working-hour
                                slots:
                            </Text>

                            {availableSlots.map(
                                (
                                    slot,
                                    index
                                ) => (
                                    <Text
                                        key={index}
                                        style={{
                                            color:
                                                colors.text,
                                        }}
                                    >
                                        •{" "}
                                        {formatSlot(
                                            slot.start,
                                            slot.end
                                        )}
                                    </Text>
                                )
                            )}
                        </View>
                    )}
                </>
            )}
        </View>
    );
}
