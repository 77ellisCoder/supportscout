import {
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";

import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import {
    useState,
} from "react";

import {
    styles,
} from "../../styles/availability-preferences.styles";

type Props = {
    value: string;
    onChange: (
        value: string
    ) => void;
};

export function AvailabilityTimePicker({
    value,
    onChange,
}: Props) {
    const [
        showPicker,
        setShowPicker,
    ] = useState(false);

    function handleChange(
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) {
        if (
            Platform.OS ===
            "android"
        ) {
            setShowPicker(
                false
            );
        }

        if (
            event.type ===
                "set" &&
            selectedDate
        ) {
            onChange(
                formatTime(
                    selectedDate
                )
            );
        }
    }

    return (
        <View>
            <Pressable
                onPress={() =>
                    setShowPicker(
                        true
                    )
                }
                style={({ pressed }) => [
                    styles.timePickerButton,
                    pressed &&
                        styles.timePickerButtonPressed,
                ]}
            >
                <Text
                    style={
                        styles.timePickerButtonText
                    }
                >
                    {
                        formatDisplayTime(
                            value
                        )
                    }
                </Text>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={
                        parseTime(
                            value
                        )
                    }

                    mode="time"

                    is24Hour={
                        false
                    }

                    display={
                        Platform.OS ===
                        "android"
                            ? "clock"
                            : "default"
                    }

                    onChange={
                        handleChange
                    }
                />
            )}
        </View>
    );
}

function parseTime(
    value: string
): Date {
    const [
        hours,
        minutes,
    ] = value
        .slice(0, 5)
        .split(":")
        .map(Number);

    const date =
        new Date();

    date.setHours(
        hours || 0,
        minutes || 0,
        0,
        0
    );

    return date;
}

function formatTime(
    date: Date
): string {
    const hours =
        String(
            date.getHours()
        ).padStart(
            2,
            "0"
        );

    const minutes =
        String(
            date.getMinutes()
        ).padStart(
            2,
            "0"
        );

    return `${hours}:${minutes}`;
}

function formatDisplayTime(
    value: string
): string {
    return parseTime(
        value
    ).toLocaleTimeString(
        "en-AU",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    );
}