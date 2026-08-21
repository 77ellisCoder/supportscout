import { useState } from "react";

import {
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";

import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { styles } from "../../styles/gig-form.styles";

type GigDatePickerProps = {
    value: string;
    onChange: (value: string) => void;
};

export function GigDatePicker({
    value,
    onChange,
}: GigDatePickerProps) {
    const [showPicker, setShowPicker] =
        useState(false);

    function handleChange(
        event: DateTimePickerEvent,
        selectedDate?: Date
    ) {
        if (Platform.OS === "android") {
            setShowPicker(false);
        }

        if (
            event.type === "set" &&
            selectedDate
        ) {
            onChange(
                formatDatabaseDate(selectedDate)
            );
        }
    }

    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>
                Gig date
            </Text>

            <Pressable
                onPress={() => setShowPicker(true)}
                style={({ pressed }) => [
                    styles.dateButton,
                    pressed && styles.dateButtonPressed,
                ]}
            >
                <Text
                    style={[
                        styles.dateButtonText,
                        !value &&
                        styles.dateButtonPlaceholder,
                    ]}
                >
                    {value
                        ? formatDisplayDate(value)
                        : "Select a date"}
                </Text>

                <Text style={styles.calendarIcon}>
                    📅
                </Text>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={
                        value
                            ? parseDatabaseDate(value)
                            : new Date()
                    }
                    mode="date"
                    display={
                        Platform.OS === "android"
                            ? "calendar"
                            : "default"
                    }
                    onChange={handleChange}
                />
            )}
        </View>
    );
}

function formatDatabaseDate(
    date: Date
): string {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function parseDatabaseDate(
    value: string
): Date {
    const [year, month, day] =
        value.split("-").map(Number);

    return new Date(
        year,
        month - 1,
        day
    );
}

function formatDisplayDate(
    value: string
): string {
    return parseDatabaseDate(
        value
    ).toLocaleDateString("en-AU", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}