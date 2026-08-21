import { useMemo, useState } from "react";

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

import { styles } from "../../styles/gig-form.styles";

type GigDatePickerProps = {
    value: string;
    onChange: (value: string) => void;
};

const WEEKDAYS = [
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
    "Su",
];

export function GigDatePicker({
    value,
    onChange,
}: GigDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedDate = value
        ? parseDatabaseDate(value)
        : null;

    const [visibleMonth, setVisibleMonth] =
        useState<Date>(
            selectedDate
                ? new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    1
                )
                : startOfMonth(new Date())
        );

    const days = useMemo(
        () => buildCalendarDays(visibleMonth),
        [visibleMonth]
    );

    function previousMonth() {
        setVisibleMonth(
            new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth() - 1,
                1
            )
        );
    }

    function nextMonth() {
        setVisibleMonth(
            new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth() + 1,
                1
            )
        );
    }

    function selectDate(date: Date) {
        onChange(formatDatabaseDate(date));
    }

    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>
                Gig date
            </Text>

            <Pressable
                onPress={() => setIsOpen((current) => !current)}
                style={({ pressed }) => [
                    styles.dateButton,
                    pressed && styles.dateButtonPressed,
                ]}
            >
                <Text
                    style={[
                        styles.dateButtonText,
                        !value && styles.dateButtonPlaceholder,
                    ]}
                >
                    {selectedDate
                        ? formatDisplayDate(selectedDate)
                        : "Select a date"}
                </Text>

                <Text style={styles.calendarIcon}>
                    📅
                </Text>
            </Pressable>

            {isOpen && (
                <View style={webStyles.calendar}>
                    <View style={webStyles.calendarHeader}>
                        <Pressable
                            onPress={previousMonth}
                            style={({ pressed }) => [
                                webStyles.monthButton,
                                pressed && webStyles.monthButtonPressed,
                            ]}
                        >
                            <Text style={webStyles.monthButtonText}>
                                ‹
                            </Text>
                        </Pressable>

                        <View style={webStyles.monthHeading}>
                            <Text style={webStyles.monthName}>
                                {visibleMonth
                                    .toLocaleDateString("en-AU", {
                                        month: "long",
                                    })
                                    .toUpperCase()}
                            </Text>

                            <Text style={webStyles.year}>
                                {visibleMonth.getFullYear()}
                            </Text>
                        </View>

                        <Pressable
                            onPress={nextMonth}
                            style={({ pressed }) => [
                                webStyles.monthButton,
                                pressed && webStyles.monthButtonPressed,
                            ]}
                        >
                            <Text style={webStyles.monthButtonText}>
                                ›
                            </Text>
                        </Pressable>
                    </View>

                    <View style={webStyles.weekdayRow}>
                        {WEEKDAYS.map((weekday) => (
                            <Text
                                key={weekday}
                                style={webStyles.weekday}
                            >
                                {weekday}
                            </Text>
                        ))}
                    </View>

                    <View style={webStyles.daysGrid}>
                        {days.map((day, index) => {
                            if (!day) {
                                return (
                                    <View
                                        key={`empty-${index}`}
                                        style={webStyles.dayCell}
                                    />
                                );
                            }

                            const selected =
                                selectedDate &&
                                isSameDate(day, selectedDate);

                            const today =
                                isSameDate(day, new Date());

                            return (
                                <Pressable
                                    key={formatDatabaseDate(day)}
                                    onPress={() => {
                                        selectDate(day);

                                        // Close after choosing a date
                                        setIsOpen(false);
                                    }}
                                    style={({ pressed }) => [
                                        webStyles.dayCell,
                                        today && webStyles.todayCell,
                                        selected && webStyles.selectedDayCell,
                                        pressed &&
                                        !selected &&
                                        webStyles.dayCellPressed,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            webStyles.dayText,
                                            today && webStyles.todayText,
                                            selected &&
                                            webStyles.selectedDayText,
                                        ]}
                                    >
                                        {day.getDate()}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
}

function startOfMonth(
    date: Date
): Date {
    return new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    );
}

function buildCalendarDays(
    month: Date
): Array<Date | null> {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    const firstDay = new Date(
        year,
        monthIndex,
        1
    );

    const daysInMonth = new Date(
        year,
        monthIndex + 1,
        0
    ).getDate();

    // JS: Sunday = 0.
    // We want Monday = 0.
    const leadingBlankCount =
        (firstDay.getDay() + 6) % 7;

    const result: Array<Date | null> = [];

    for (
        let index = 0;
        index < leadingBlankCount;
        index++
    ) {
        result.push(null);
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {
        result.push(
            new Date(
                year,
                monthIndex,
                day
            )
        );
    }

    return result;
}

function isSameDate(
    first: Date,
    second: Date
): boolean {
    return (
        first.getFullYear() ===
        second.getFullYear() &&
        first.getMonth() ===
        second.getMonth() &&
        first.getDate() ===
        second.getDate()
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
    date: Date
): string {
    return date.toLocaleDateString(
        "en-AU",
        {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );
}

const webStyles = StyleSheet.create({
    calendar: {
        width: "100%",
        maxWidth: 380,

        alignSelf: "flex-start",

        backgroundColor: colors.backgroundDeep,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.md,

        marginTop: spacing.sm,
    },

    calendarHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginBottom: spacing.lg,
    },

    monthHeading: {
        alignItems: "center",
    },

    monthName: {
        ...typography.h3,
        color: colors.text,
        fontSize: 18,
    },

    year: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: 2,
    },

    monthButton: {
        width: 40,
        height: 40,

        borderRadius: radius.pill,

        alignItems: "center",
        justifyContent: "center",
    },

    monthButtonPressed: {
        backgroundColor: colors.primaryMuted,
    },

    monthButtonText: {
        color: colors.primaryLight,

        fontSize: 28,
        lineHeight: 30,
    },

    weekdayRow: {
        flexDirection: "row",

        marginBottom: spacing.sm,
    },

    weekday: {
        width: `${100 / 7}%`,

        ...typography.small,

        color: colors.textMuted,
        fontSize: 11,

        textAlign: "center",
        fontWeight: "700",
    },

    daysGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },

    dayCell: {
        width: `${100 / 7}%`,
        height: 38,

        alignItems: "center",
        justifyContent: "center",

        borderRadius: radius.md,
    },

    dayCellPressed: {
        backgroundColor: colors.surfaceHover,
    },

    todayCell: {
        borderWidth: 1,
        borderColor: colors.primary,
    },

    selectedDayCell: {
        backgroundColor: colors.primary,
    },

    dayText: {
        ...typography.small,

        color: colors.textSecondary,
        fontSize: 13,
    },

    todayText: {
        color: colors.primaryLight,
        fontWeight: "700",
    },

    selectedDayText: {
        color: colors.white,
        fontWeight: "700",
    },

    selectedRow: {
        marginTop: spacing.lg,
        paddingTop: spacing.md,

        borderTopWidth: 1,
        borderTopColor: colors.border,

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        gap: spacing.md,
    },

    selectedLabel: {
        ...typography.label,

        color: colors.textMuted,
        fontSize: 9,
    },

    selectedValue: {
        ...typography.small,

        color: colors.primaryLight,
        fontWeight: "700",
        textAlign: "right",

        flexShrink: 1,
    },
});