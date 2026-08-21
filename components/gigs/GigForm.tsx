import { useMemo, useState } from "react";
import {
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

export type GigFormValues = {
    eventName: string;
    gigDate: string;
    venueId: number | null;
    status: GigStatus;
    notes: string;
    bandIds: number[];
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
    onSubmit: (values: GigFormValues) => Promise<void> | void;
};

const DEFAULT_VALUES: GigFormValues = {
    eventName: "",
    gigDate: "",
    venueId: null,
    status: "confirmed",
    notes: "",
    bandIds: [],
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
    const [values, setValues] = useState<GigFormValues>({
        ...DEFAULT_VALUES,
        ...initialValues,
    });

    const updateField = <K extends keyof GigFormValues>(
        key: K,
        value: GigFormValues[K]
    ) => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const toggleBand = (bandId: number) => {
        updateField(
            "bandIds",
            values.bandIds.includes(bandId)
                ? values.bandIds.filter((id) => id !== bandId)
                : [...values.bandIds, bandId]
        );
    };

    const sortedVenues = useMemo(
        () =>
            [...venues].sort((a, b) =>
                a.venueName.localeCompare(b.venueName)
            ),
        [venues]
    );

    const sortedBands = useMemo(
        () =>
            [...bands].sort((a, b) =>
                a.bandName.localeCompare(b.bandName)
            ),
        [bands]
    );

    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.eyebrow}>{eyebrow}</Text>
            <Text style={styles.title}>{title}</Text>

            {error && (
                <View style={styles.errorCard}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <Field
                label="Event name"
                value={values.eventName}
                onChangeText={(value) =>
                    updateField("eventName", value)
                }
                placeholder="Friday Night at Mojos"
            />

            <Field
                label="Gig date"
                value={values.gigDate}
                onChangeText={(value) =>
                    updateField("gigDate", value)
                }
                placeholder="2026-09-18"
                autoCapitalize="none"
            />

            <Text style={styles.sectionLabel}>Venue</Text>

            <View style={styles.optionGrid}>
                {sortedVenues.map((venue) => (
                    <Pressable
                        key={venue.venueId}
                        onPress={() =>
                            updateField("venueId", venue.venueId)
                        }
                        style={[
                            styles.optionChip,
                            values.venueId === venue.venueId &&
                            styles.optionChipSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.optionChipText,
                                values.venueId === venue.venueId &&
                                styles.optionChipTextSelected,
                            ]}
                        >
                            {venue.venueName}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.sectionLabel}>Status</Text>

            <View style={styles.optionGrid}>
                {(
                    [
                        "tentative",
                        "confirmed",
                        "completed",
                        "cancelled",
                    ] as GigStatus[]
                ).map((status) => (
                    <Pressable
                        key={status}
                        onPress={() =>
                            updateField("status", status)
                        }
                        style={[
                            styles.optionChip,
                            values.status === status &&
                            styles.optionChipSelected,
                        ]}
                    >
                        <Text
                            style={[
                                styles.optionChipText,
                                values.status === status &&
                                styles.optionChipTextSelected,
                            ]}
                        >
                            {status}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Text style={styles.sectionLabel}>Lineup</Text>

            <View style={styles.optionGrid}>
                {sortedBands.map((band) => {
                    const selected = values.bandIds.includes(
                        band.bandId
                    );

                    return (
                        <Pressable
                            key={band.bandId}
                            onPress={() => toggleBand(band.bandId)}
                            style={[
                                styles.optionChip,
                                selected && styles.optionChipSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionChipText,
                                    selected &&
                                    styles.optionChipTextSelected,
                                ]}
                            >
                                {band.bandName}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <Field
                label="Notes"
                value={values.notes}
                onChangeText={(value) =>
                    updateField("notes", value)
                }
                multiline
            />

            <Pressable
                disabled={saving}
                onPress={() => onSubmit(values)}
                style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.saveButtonPressed,
                    saving && styles.saveButtonDisabled,
                ]}
            >
                <Text style={styles.saveButtonText}>
                    {saving ? "Saving..." : submitLabel}
                </Text>
            </Pressable>
        </ScrollView>
    );
}

type FieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
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
    autoCapitalize,
}: FieldProps) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                multiline={multiline}
                autoCapitalize={autoCapitalize}
                style={[
                    styles.input,
                    multiline && styles.textArea,
                ]}
            />
        </View>
    );
}