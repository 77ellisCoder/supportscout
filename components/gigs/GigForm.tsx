import { useMemo, useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import type { Band } from "../../models/Band";
import type { GigStatus } from "../../models/Gig";
import type { Venue } from "../../models/Venue";

import { colors } from "../../theme";
import { styles } from "../../styles/gig-form.styles";

import { GigDatePicker } from "./GigDatePicker";

import {
    LineupBuilder,
    type LineupItem,
} from "./LineupBuilder";

export type GigFormValues = {
    eventName: string;
    gigDate: string;
    venueId: number | null;
    status: GigStatus;
    notes: string;
    lineup: LineupItem[];
};

type GigFormProps = {
    venues: Venue[];
    bands: Band[];

    initialValues?: Partial<GigFormValues>;

    title: string;
    eyebrow: string;
    submitLabel: string;

    saving?: boolean;
    error?: string | null;

    onSubmit: (
        values: GigFormValues
    ) => Promise<void> | void;
};

const DEFAULT_VALUES: GigFormValues = {
    eventName: "",
    gigDate: "",
    venueId: null,
    status: "confirmed",
    notes: "",
    lineup: [],
};

export function GigForm({
    venues,
    bands,
    initialValues,
    title,
    eyebrow,
    submitLabel,
    saving = false,
    error,
    onSubmit,
}: GigFormProps) {
    const [values, setValues] =
        useState<GigFormValues>({
            ...DEFAULT_VALUES,
            ...initialValues,
        });

    const updateField = <
        K extends keyof GigFormValues
    >(
        key: K,
        value: GigFormValues[K]
    ) => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const sortedVenues = useMemo(
        () =>
            [...venues].sort((a, b) =>
                a.venueName.localeCompare(
                    b.venueName
                )
            ),
        [venues]
    );

    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={
                styles.container
            }
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.eyebrow}>
                {eyebrow}
            </Text>

            <Text style={styles.title}>
                {title}
            </Text>

            {error && (
                <View style={styles.errorCard}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            )}

            <Field
                label="Event name"
                value={values.eventName}
                onChangeText={(value) =>
                    updateField(
                        "eventName",
                        value
                    )
                }
                placeholder="Friday Night at Mojos"
            />

            <GigDatePicker
                value={values.gigDate}
                onChange={(value) =>
                    updateField(
                        "gigDate",
                        value
                    )
                }
            />

            <Text style={styles.sectionLabel}>
                Venue
            </Text>

            <View style={styles.optionGrid}>
                {sortedVenues.map((venue) => {
                    const selected =
                        values.venueId ===
                        venue.venueId;

                    return (
                        <Pressable
                            key={venue.venueId}
                            onPress={() =>
                                updateField(
                                    "venueId",
                                    venue.venueId
                                )
                            }
                            style={[
                                styles.optionChip,
                                selected &&
                                styles.optionChipSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionChipText,
                                    selected &&
                                    styles.optionChipTextSelected,
                                ]}
                            >
                                {venue.venueName}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <Text style={styles.sectionLabel}>
                Status
            </Text>

            <View style={styles.optionGrid}>
                {(
                    [
                        "tentative",
                        "confirmed",
                        "completed",
                        "cancelled",
                    ] as GigStatus[]
                ).map((status) => {
                    const selected =
                        values.status === status;

                    return (
                        <Pressable
                            key={status}
                            onPress={() =>
                                updateField(
                                    "status",
                                    status
                                )
                            }
                            style={[
                                styles.optionChip,
                                selected &&
                                styles.optionChipSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionChipText,
                                    selected &&
                                    styles.optionChipTextSelected,
                                ]}
                            >
                                {formatStatus(status)}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <LineupBuilder
                bands={bands}
                value={values.lineup}
                onChange={(lineup) =>
                    updateField(
                        "lineup",
                        lineup
                    )
                }
            />

            <Field
                label="Notes"
                value={values.notes}
                onChangeText={(value) =>
                    updateField(
                        "notes",
                        value
                    )
                }
                multiline
            />

            <Pressable
                disabled={saving}
                onPress={() =>
                    onSubmit(values)
                }
                style={({ pressed }) => [
                    styles.saveButton,
                    pressed &&
                    styles.saveButtonPressed,
                    saving &&
                    styles.saveButtonDisabled,
                ]}
            >
                {saving ? (
                    <ActivityIndicator
                        color={colors.white}
                    />
                ) : (
                    <Text
                        style={
                            styles.saveButtonText
                        }
                    >
                        {submitLabel}
                    </Text>
                )}
            </Pressable>
        </ScrollView>
    );
}

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (
        value: string
    ) => void;

    placeholder?: string;
    multiline?: boolean;

    keyboardType?: React.ComponentProps<
        typeof TextInput
    >["keyboardType"];

    autoCapitalize?: React.ComponentProps<
        typeof TextInput
    >["autoCapitalize"];
};

function Field({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType,
    autoCapitalize,
}: FieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>
                {label}
            </Text>

            <TextInput
                value={value}
                onChangeText={
                    onChangeText
                }
                placeholder={placeholder}
                placeholderTextColor={
                    colors.textMuted
                }
                keyboardType={
                    keyboardType
                }
                autoCapitalize={
                    autoCapitalize
                }
                multiline={multiline}
                style={[
                    styles.input,
                    multiline &&
                    styles.textArea,
                ]}
            />
        </View>
    );
}

function formatStatus(
    status: GigStatus
): string {
    return status
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}