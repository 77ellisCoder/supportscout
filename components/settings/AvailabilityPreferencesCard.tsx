import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    Button,
} from "../ui/Button";

import {
    AvailabilityWindow,
} from "../../services/calendar/CalendarService";

import {
    AvailabilityTimePicker,
} from "./AvailabilityTimePicker";

import {
    useAvailabilityPreferences,
    useSaveAvailabilityPreferences,
} from "../../hooks/useAvailabilityPreferences";

import {
    styles,
} from "../../styles/availability-preferences.styles";

type Props = {
    userId: number;
};

type DayDefinition = {
    dayOfWeek: number;
    label: string;
};

const days: DayDefinition[] = [
    {
        dayOfWeek: 1,
        label: "Monday",
    },
    {
        dayOfWeek: 2,
        label: "Tuesday",
    },
    {
        dayOfWeek: 3,
        label: "Wednesday",
    },
    {
        dayOfWeek: 4,
        label: "Thursday",
    },
    {
        dayOfWeek: 5,
        label: "Friday",
    },
    {
        dayOfWeek: 6,
        label: "Saturday",
    },
    {
        dayOfWeek: 0,
        label: "Sunday",
    },
];

function normalizeTime(
    value: string
) {
    return value.slice(
        0,
        5
    );
}

export default function AvailabilityPreferencesCard({
    userId,
}: Props) {
    const preferences =
        useAvailabilityPreferences(
            userId
        );

    const savePreferences =
        useSaveAvailabilityPreferences(
            userId
        );

    const [
        minimumMinutes,
        setMinimumMinutes,
    ] = useState("60");

    const [
        bufferMinutes,
        setBufferMinutes,
    ] = useState("30");

    const [
        windows,
        setWindows,
    ] = useState<
        AvailabilityWindow[]
    >([]);

    useEffect(() => {
        if (
            !preferences.data
        ) {
            return;
        }

        setMinimumMinutes(
            String(
                preferences.data
                    .minimumMinutes
            )
        );

        setBufferMinutes(
            String(
                preferences.data
                    .bufferMinutes
            )
        );

        setWindows(
            preferences.data.windows.map(
                (window) => ({
                    ...window,

                    startTime:
                        normalizeTime(
                            window.startTime
                        ),

                    endTime:
                        normalizeTime(
                            window.endTime
                        ),
                })
            )
        );
    }, [
        preferences.data,
    ]);

    const windowsByDay =
        useMemo(() => {
            const map =
                new Map<
                    number,
                    AvailabilityWindow
                >();

            for (
                const window of
                windows
            ) {
                if (
                    !map.has(
                        window.dayOfWeek
                    )
                ) {
                    map.set(
                        window.dayOfWeek,
                        window
                    );
                }
            }

            return map;
        }, [
            windows,
        ]);

    function toggleDay(
        dayOfWeek: number
    ) {
        const existing =
            windowsByDay.get(
                dayOfWeek
            );

        if (existing) {
            setWindows(
                (
                    current
                ) =>
                    current.filter(
                        (
                            window
                        ) =>
                            window.dayOfWeek !==
                            dayOfWeek
                    )
            );

            return;
        }

        setWindows(
            (
                current
            ) => [
                    ...current,
                    {
                        dayOfWeek,
                        startTime:
                            "18:00",
                        endTime:
                            "23:00",
                    },
                ]
        );
    }

    function updateWindow(
        dayOfWeek: number,
        field:
            | "startTime"
            | "endTime",
        value: string
    ) {
        setWindows(
            (
                current
            ) =>
                current.map(
                    (
                        window
                    ) =>
                        window.dayOfWeek ===
                            dayOfWeek
                            ? {
                                ...window,
                                [field]:
                                    value,
                            }
                            : window
                )
        );
    }

    async function handleSave() {
        const minimum =
            Number(
                minimumMinutes
            );

        const buffer =
            Number(
                bufferMinutes
            );

        if (
            !Number.isFinite(
                minimum
            ) ||
            minimum < 15
        ) {
            return;
        }

        if (
            !Number.isFinite(
                buffer
            ) ||
            buffer < 0
        ) {
            return;
        }

        await savePreferences.mutateAsync({
            minimumMinutes:
                minimum,

            bufferMinutes:
                buffer,

            timezone:
                "Australia/Perth",

            windows:
                [...windows].sort(
                    (
                        a,
                        b
                    ) =>
                        a.dayOfWeek -
                        b.dayOfWeek
                ),
        });
    }

    if (
        preferences.isLoading
    ) {
        return (
            <View
                style={
                    styles.loading
                }
            >
                <ActivityIndicator />

                <Text
                    style={
                        styles.loadingText
                    }
                >
                    Loading availability settings…
                </Text>
            </View>
        );
    }

    if (
        preferences.isError
    ) {
        return (
            <View
                style={
                    styles.errorBox
                }
            >
                <Text
                    style={
                        styles.errorText
                    }
                >
                    Unable to load availability settings.
                </Text>
            </View>
        );
    }

    return (
        <View
            style={
                styles.card
            }
        >
            <View
                style={
                    styles.header
                }
            >
                <Text
                    style={
                        styles.title
                    }
                >
                    Availability
                </Text>

                <Text
                    style={
                        styles.subtitle
                    }
                >
                    Set the times you are generally available for gigs and rehearsals.
                </Text>
            </View>

            <View
                style={
                    styles.settingRow
                }
            >
                <View
                    style={
                        styles.settingText
                    }
                >
                    <Text
                        style={
                            styles.settingLabel
                        }
                    >
                        Minimum useful slot
                    </Text>

                    <Text
                        style={
                            styles.settingDescription
                        }
                    >
                        Ignore shorter gaps in your calendar.
                    </Text>
                </View>

                <View
                    style={
                        styles.numberField
                    }
                >
                    <TextInput
                        value={
                            minimumMinutes
                        }

                        onChangeText={
                            setMinimumMinutes
                        }

                        keyboardType="numeric"

                        style={
                            styles.numberInput
                        }
                    />

                    <Text
                        style={
                            styles.unitText
                        }
                    >
                        min
                    </Text>
                </View>
            </View>

            <View
                style={
                    styles.settingRow
                }
            >
                <View
                    style={
                        styles.settingText
                    }
                >
                    <Text
                        style={
                            styles.settingLabel
                        }
                    >
                        Calendar buffer
                    </Text>

                    <Text
                        style={
                            styles.settingDescription
                        }
                    >
                        Add breathing room before and after calendar events.
                    </Text>
                </View>

                <View
                    style={
                        styles.numberField
                    }
                >
                    <TextInput
                        value={
                            bufferMinutes
                        }

                        onChangeText={
                            setBufferMinutes
                        }

                        keyboardType="numeric"

                        style={
                            styles.numberInput
                        }
                    />

                    <Text
                        style={
                            styles.unitText
                        }
                    >
                        min
                    </Text>
                </View>
            </View>

            <View
                style={
                    styles.timezoneBox
                }
            >
                <Text
                    style={
                        styles.settingLabel
                    }
                >
                    Timezone
                </Text>

                <Text
                    style={
                        styles.timezoneValue
                    }
                >
                    Australia/Perth
                </Text>
            </View>

            <View
                style={
                    styles.divider
                }
            />

            <Text
                style={
                    styles.sectionTitle
                }
            >
                Weekly availability
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={
                    false
                }
            >
                <View
                    style={
                        styles.days
                    }
                >
                    {days.map(
                        (
                            day
                        ) => {
                            const window =
                                windowsByDay.get(
                                    day.dayOfWeek
                                );

                            const enabled =
                                Boolean(
                                    window
                                );

                            return (
                                <View
                                    key={
                                        day.dayOfWeek
                                    }

                                    style={
                                        styles.dayRow
                                    }
                                >
                                    <Pressable
                                        onPress={() =>
                                            toggleDay(
                                                day.dayOfWeek
                                            )
                                        }

                                        style={[
                                            styles.dayToggle,

                                            enabled
                                                ? styles.dayToggleEnabled
                                                : styles.dayToggleDisabled,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayToggleText,

                                                enabled &&
                                                styles.dayToggleTextEnabled,
                                            ]}
                                        >
                                            {
                                                day.label
                                            }
                                        </Text>
                                    </Pressable>

                                    {enabled &&
                                        window && (
                                            <View
                                                style={
                                                    styles.timeFields
                                                }
                                            >
                                                <AvailabilityTimePicker
                                                    value={
                                                        window.startTime
                                                    }

                                                    onChange={(
                                                        value
                                                    ) =>
                                                        updateWindow(
                                                            day.dayOfWeek,
                                                            "startTime",
                                                            value
                                                        )
                                                    }
                                                />

                                                <Text
                                                    style={
                                                        styles.toText
                                                    }
                                                >
                                                    to
                                                </Text>

                                                <AvailabilityTimePicker
                                                    value={
                                                        window.endTime
                                                    }

                                                    onChange={(
                                                        value
                                                    ) =>
                                                        updateWindow(
                                                            day.dayOfWeek,
                                                            "endTime",
                                                            value
                                                        )
                                                    }
                                                />
                                            </View>
                                        )}
                                </View>
                            );
                        }
                    )}
                </View>
            </ScrollView>

            {savePreferences.isError && (
                <Text
                    style={
                        styles.saveError
                    }
                >
                    {
                        savePreferences
                            .error
                            .message
                    }
                </Text>
            )}

            {savePreferences.isSuccess && (
                <Text
                    style={
                        styles.saveSuccess
                    }
                >
                    Availability settings saved.
                </Text>
            )}

            <Button
                title="Save availability"
                onPress={handleSave}
                loading={
                    savePreferences.isPending
                }
            />
        </View>
    );
}