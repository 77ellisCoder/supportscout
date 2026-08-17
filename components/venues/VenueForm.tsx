import { useState } from "react";

import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

import type { Venue, VenueStatus } from "../../models/Venue";
import { colors } from "../../theme";
import { styles } from "../../styles/venue-form.styles";

export type VenueFormValues = {
    venueName: string;
    suburb: string;
    address: string;
    capacity: string;
    venueType: string;
    websiteUrl: string;
    bookingUrl: string;
    bookingEmail: string;
    shortDescription: string;
    internalNotes: string;
    status: VenueStatus;
    isVerified: boolean;
};

type VenueFormProps = {
    initialValues?: Partial<VenueFormValues>;
    title: string;
    eyebrow: string;
    submitLabel: string;
    saving?: boolean;
    error?: string | null;
    onSubmit: (values: VenueFormValues) => Promise<void> | void;
};

const DEFAULT_VALUES: VenueFormValues = {
    venueName: "",
    suburb: "",
    address: "",
    capacity: "",
    venueType: "",
    websiteUrl: "",
    bookingUrl: "",
    bookingEmail: "",
    shortDescription: "",
    internalNotes: "",
    status: "active",
    isVerified: false,
};

export function VenueForm({
    initialValues,
    title,
    eyebrow,
    submitLabel,
    saving = false,
    error,
    onSubmit,
}: VenueFormProps) {
    const [values, setValues] = useState<VenueFormValues>({
        ...DEFAULT_VALUES,
        ...initialValues,
    });

    const updateField = <K extends keyof VenueFormValues>(
        key: K,
        value: VenueFormValues[K]
    ) => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={styles.container}
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
                label="Venue name"
                value={values.venueName}
                onChangeText={(value) =>
                    updateField("venueName", value)
                }
            />

            <Field
                label="Suburb"
                value={values.suburb}
                onChangeText={(value) =>
                    updateField("suburb", value)
                }
            />

            <Field
                label="Address"
                value={values.address}
                onChangeText={(value) =>
                    updateField("address", value)
                }
            />

            <Field
                label="Capacity"
                value={values.capacity}
                onChangeText={(value) =>
                    updateField("capacity", value)
                }
                keyboardType="number-pad"
            />

            <Field
                label="Venue type"
                value={values.venueType}
                onChangeText={(value) =>
                    updateField("venueType", value)
                }
                placeholder="live_music_bar"
            />

            <Field
                label="Website"
                value={values.websiteUrl}
                onChangeText={(value) =>
                    updateField("websiteUrl", value)
                }
                keyboardType="url"
                autoCapitalize="none"
            />

            <Field
                label="Booking URL"
                value={values.bookingUrl}
                onChangeText={(value) =>
                    updateField("bookingUrl", value)
                }
                keyboardType="url"
                autoCapitalize="none"
            />

            <Field
                label="Booking email"
                value={values.bookingEmail}
                onChangeText={(value) =>
                    updateField("bookingEmail", value)
                }
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Field
                label="Description"
                value={values.shortDescription}
                onChangeText={(value) =>
                    updateField("shortDescription", value)
                }
                multiline
            />

            <Field
                label="Internal notes"
                value={values.internalNotes}
                onChangeText={(value) =>
                    updateField("internalNotes", value)
                }
                multiline
            />

            <View style={styles.section}>
                <Text style={styles.fieldLabel}>
                    Status
                </Text>

                <View style={styles.statusRow}>
                    {(
                        [
                            "active",
                            "inactive",
                            "closed",
                            "unknown",
                        ] as VenueStatus[]
                    ).map((status) => (
                        <Pressable
                            key={status}
                            onPress={() =>
                                updateField("status", status)
                            }
                            style={[
                                styles.statusChip,
                                values.status === status &&
                                styles.statusChipSelected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.statusChipText,
                                    values.status === status &&
                                    styles.statusChipTextSelected,
                                ]}
                            >
                                {status}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <View style={styles.switchRow}>
                <View>
                    <Text style={styles.fieldLabel}>
                        Verified
                    </Text>

                    <Text style={styles.helperText}>
                        Mark this venue as verified research.
                    </Text>
                </View>

                <Switch
                    value={values.isVerified}
                    onValueChange={(value) =>
                        updateField("isVerified", value)
                    }
                    trackColor={{
                        false: colors.border,
                        true: colors.primary,
                    }}
                />
            </View>

            <Pressable
                disabled={saving}
                onPress={() => onSubmit(values)}
                style={({ pressed }) => [
                    styles.saveButton,
                    pressed && styles.saveButtonPressed,
                    saving && styles.saveButtonDisabled,
                ]}
            >
                {saving ? (
                    <ActivityIndicator color={colors.white} />
                ) : (
                    <Text style={styles.saveButtonText}>
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
    onChangeText: (value: string) => void;
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
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                multiline={multiline}
                style={[
                    styles.input,
                    multiline && styles.textArea,
                ]}
            />
        </View>
    );
}