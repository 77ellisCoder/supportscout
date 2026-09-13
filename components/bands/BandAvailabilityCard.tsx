import {
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";

import {
    useBandAvailability,
} from "../../hooks/useBandCalendar";

import { colors } from "../../theme";

type Props = {
    bandId: number;
};

type GroupedAvailability = {
    dateKey: string;
    dateLabel: string;
    slots: {
        start: string;
        end: string;
    }[];
};

function startOfDay(value: Date) {
    const result = new Date(value);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}

function addDays(
    value: Date,
    days: number
) {
    const result =
        new Date(value);

    result.setDate(
        result.getDate() +
        days
    );

    return result;
}

function formatTime(
    value: string
) {
    return new Date(
        value
    ).toLocaleTimeString(
        "en-AU",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    );
}

function formatDateLabel(
    value: string
) {
    return new Date(
        value
    ).toLocaleDateString(
        "en-AU",
        {
            weekday: "short",
            day: "numeric",
            month: "short",
        }
    );
}

function groupAvailabilityByDay(
    slots: {
        start: string;
        end: string;
    }[]
): GroupedAvailability[] {
    const grouped =
        new Map<
            string,
            GroupedAvailability
        >();

    for (const slot of slots) {
        const startDate =
            new Date(slot.start);

        const dateKey =
            startDate
                .toISOString()
                .slice(0, 10);

        let group =
            grouped.get(dateKey);

        if (!group) {
            group = {
                dateKey,
                dateLabel:
                    formatDateLabel(
                        slot.start
                    ),
                slots: [],
            };

            grouped.set(
                dateKey,
                group
            );
        }

        group.slots.push({
            start:
                slot.start,
            end:
                slot.end,
        });
    }

    return Array.from(
        grouped.values()
    );
}

function formatProvider(
    provider: string
) {
    switch (provider) {
        case "icloud":
            return "iCloud";

        case "google":
            return "Google";

        default:
            return provider;
    }
}

export function BandAvailabilityCard({
    bandId,
}: Props) {

    const [from, setFrom] =
        useState(
            startOfDay(
                new Date()
            )
        );

    const [to, setTo] =
        useState(
            addDays(
                startOfDay(
                    new Date()
                ),
                14
            )
        );

    const [
        showFromPicker,
        setShowFromPicker,
    ] = useState(false);

    const [
        showToPicker,
        setShowToPicker,
    ] = useState(false);

    const [
        showAll,
        setShowAll,
    ] = useState(false);

    const availability =
        useBandAvailability(
            bandId,
            from,
            addDays(to, 1)
        );

    const members =
        useMemo(
            () =>
                availability.data
                    ?.members ?? [],
            [availability.data]
        );

    const sharedSlots =
        useMemo(
            () =>
                availability.data
                    ?.sharedAvailable ??
                [],
            [availability.data]
        );

    const groupedAvailability =
        useMemo(
            () =>
                groupAvailabilityByDay(
                    sharedSlots
                ),
            [sharedSlots]
        );

    const connectedCount =
        useMemo(
            () =>
                members.filter(
                    (member) =>
                        member.connected
                ).length,
            [members]
        );

    const displayedAvailability =
        showAll
            ? groupedAvailability
            : groupedAvailability.slice(
                0,
                5
            );

    const hiddenDayCount =
        Math.max(
            groupedAvailability.length -
            displayedAvailability.length,
            0
        );

    return (
        <View
            style={{
                marginTop: 8,
                padding: 16,
                borderRadius: 12,
                backgroundColor:
                    colors.surface,
                gap: 14,
            }}
        >
            <View
                style={{
                    gap: 4,
                }}
            >
                <Text
                    style={{
                        color:
                            colors.text,
                        fontSize: 16,
                        fontWeight:
                            "700",
                    }}
                >
                    CALENDAR AVAILABILITY
                </Text>

                <Text
                    style={{
                        color:
                            colors.textSecondary,
                    }}
                >
                    Check when band
                    members are available
                    across their connected
                    calendars.
                </Text>
            </View>

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
                    onChange={(
                        _,
                        value
                    ) => {
                        setShowFromPicker(
                            false
                        );

                        if (!value) {
                            return;
                        }

                        const next =
                            startOfDay(
                                value
                            );

                        setFrom(
                            next
                        );

                        setShowAll(
                            false
                        );

                        if (
                            next >
                            to
                        ) {
                            setTo(
                                addDays(
                                    next,
                                    14
                                )
                            );
                        }
                    }}
                />
            )}

            {showToPicker && (
                <DateTimePicker
                    value={to}
                    mode="date"
                    minimumDate={from}
                    onChange={(
                        _,
                        value
                    ) => {
                        setShowToPicker(
                            false
                        );

                        if (!value) {
                            return;
                        }

                        setTo(
                            startOfDay(
                                value
                            )
                        );

                        setShowAll(
                            false
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
                        color:
                            colors.danger,
                    }}
                >
                    {
                        availability
                            .error
                            .message
                    }
                </Text>
            ) : (
                <>
                    <View
                        style={{
                            padding: 12,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor:
                                colors.border,
                            gap: 8,
                        }}
                    >
                        <Text
                            style={{
                                color:
                                    colors.text,
                                fontWeight:
                                    "700",
                            }}
                        >
                            {
                                connectedCount
                            }
                            /
                            {
                                members.length
                            }{" "}
                            members connected
                        </Text>

                        {members.length ===
                            0 ? (
                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                }}
                            >
                                No band
                                members have
                                been linked
                                yet.
                            </Text>
                        ) : (
                            <View
                                style={{
                                    gap: 6,
                                }}
                            >
                                {members.map(
                                    (
                                        member
                                    ) => (
                                        <View
                                            key={
                                                member.userId
                                            }
                                            style={{
                                                flexDirection:
                                                    "row",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "space-between",
                                                gap: 12,
                                            }}
                                        >
                                            <Text
                                                numberOfLines={
                                                    1
                                                }
                                                style={{
                                                    flex: 1,
                                                    color:
                                                        colors.textSecondary,
                                                }}
                                            >
                                                {member.displayName ??
                                                    member.email}
                                            </Text>

                                            <Text
                                                numberOfLines={
                                                    1
                                                }
                                                style={{
                                                    color:
                                                        member.connected
                                                            ? colors.primaryLight
                                                            : colors.textSecondary,
                                                    fontWeight:
                                                        "600",
                                                }}
                                            >
                                                {member.connected
                                                    ? member.providers
                                                        .map(
                                                            formatProvider
                                                        )
                                                        .join(
                                                            " + "
                                                        )
                                                    : "Not connected"}
                                            </Text>
                                        </View>
                                    )
                                )}
                            </View>
                        )}
                    </View>

                    <View
                        style={{
                            gap: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection:
                                    "row",
                                justifyContent:
                                    "space-between",
                                alignItems:
                                    "center",
                                gap: 12,
                            }}
                        >
                            <Text
                                style={{
                                    color:
                                        colors.text,
                                    fontWeight:
                                        "700",
                                }}
                            >
                                SHARED
                                AVAILABILITY
                            </Text>

                            {connectedCount >
                                0 && (
                                    <Text
                                        style={{
                                            color:
                                                colors.primaryLight,
                                            fontSize: 12,
                                            fontWeight:
                                                "600",
                                        }}
                                    >
                                        {
                                            connectedCount
                                        }
                                        /
                                        {
                                            connectedCount
                                        }{" "}
                                        available
                                    </Text>
                                )}
                        </View>

                        {connectedCount ===
                            0 ? (
                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                }}
                            >
                                No members have
                                connected a
                                calendar yet.
                            </Text>
                        ) : groupedAvailability.length ===
                            0 ? (
                            <Text
                                style={{
                                    color:
                                        colors.textSecondary,
                                }}
                            >
                                No shared
                                availability was
                                found for the
                                selected period.
                            </Text>
                        ) : (
                            <>
                                <View
                                    style={{
                                        gap: 10,
                                    }}
                                >
                                    {displayedAvailability.map(
                                        (
                                            group
                                        ) => (
                                            <View
                                                key={
                                                    group.dateKey
                                                }
                                                style={{
                                                    flexDirection:
                                                        "row",
                                                    alignItems:
                                                        "flex-start",
                                                    gap: 16,
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        width: 95,
                                                        color:
                                                            colors.textSecondary,
                                                        fontWeight:
                                                            "600",
                                                    }}
                                                >
                                                    {
                                                        group.dateLabel
                                                    }
                                                </Text>

                                                <View
                                                    style={{
                                                        flex: 1,
                                                        flexDirection:
                                                            "row",
                                                        flexWrap:
                                                            "wrap",
                                                        gap: 8,
                                                    }}
                                                >
                                                    {group.slots.map(
                                                        (
                                                            slot
                                                        ) => (
                                                            <View
                                                                key={`${slot.start}-${slot.end}`}
                                                                style={{
                                                                    paddingHorizontal: 10,
                                                                    paddingVertical: 6,
                                                                    borderRadius: 999,
                                                                    borderWidth: 1,
                                                                    borderColor:
                                                                        colors.border,
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        color:
                                                                            colors.text,
                                                                        fontSize: 13,
                                                                    }}
                                                                >
                                                                    {formatTime(
                                                                        slot.start
                                                                    )}{" "}
                                                                    –{" "}
                                                                    {formatTime(
                                                                        slot.end
                                                                    )}
                                                                </Text>
                                                            </View>
                                                        )
                                                    )}
                                                </View>
                                            </View>
                                        )
                                    )}
                                </View>

                                {groupedAvailability.length >
                                    5 && (
                                        <Pressable
                                            onPress={() =>
                                                setShowAll(
                                                    (
                                                        current
                                                    ) =>
                                                        !current
                                                )
                                            }
                                            style={{
                                                alignSelf:
                                                    "flex-start",
                                                paddingVertical: 6,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color:
                                                        colors.primaryLight,
                                                    fontWeight:
                                                        "700",
                                                }}
                                            >
                                                {showAll
                                                    ? "Show less"
                                                    : `Show ${hiddenDayCount} more ${hiddenDayCount ===
                                                        1
                                                        ? "day"
                                                        : "days"
                                                    }`}
                                            </Text>
                                        </Pressable>
                                    )}
                            </>
                        )}
                    </View>
                </>
            )}
        </View>
    );
}