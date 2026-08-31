import { useState } from "react";

import {
    Pressable,
    ScrollView,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

import type { BandStatus } from "../../models/Band";
import { colors } from "../../theme";
import { styles } from "../../styles/band-form.styles";
import { PageHeader } from "../ui/PageHeader";
import { FormActions } from "../ui/FormActions";

export type BandFormValues = {
    bandName: string;
    slug: string;
    hometown: string;
    stateRegion: string;
    countryCode: string;
    memberCount: string;
    formationYear: string;
    shortDescription: string;
    internalNotes: string;
    status: BandStatus;
    isOurBand: boolean;
    isVerified: boolean;
};

type BandFormProps = {
    initialValues?: Partial<BandFormValues>;
    title: string;
    eyebrow: string;
    submitLabel: string;
    saving?: boolean;
    error?: string | null;
    onSubmit: (
        values: BandFormValues
    ) => Promise<void> | void;
};

const DEFAULT_VALUES: BandFormValues = {
    bandName: "",
    slug: "",
    hometown: "Perth",
    stateRegion: "Western Australia",
    countryCode: "AU",
    memberCount: "",
    formationYear: "",
    shortDescription: "",
    internalNotes: "",
    status: "active",
    isOurBand: false,
    isVerified: false,
};

export function BandForm({
    initialValues,
    title,
    eyebrow,
    submitLabel,
    saving = false,
    error,
    onSubmit,
}: BandFormProps) {
    const [values, setValues] =
        useState<BandFormValues>({
            ...DEFAULT_VALUES,
            ...initialValues,
        });

    const updateField = <
        K extends keyof BandFormValues
    >(
        key: K,
        value: BandFormValues[K]
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
            <PageHeader
                showBack
                eyebrow={eyebrow}
                title={title}
            />

            {error && (
                <View style={styles.errorCard}>
                    <Text style={styles.errorText}>
                        {error}
                    </Text>
                </View>
            )}

            <Field
                label="Band Name"
                value={values.bandName}
                onChangeText={(value) =>
                    updateField("bandName", value)
                }
            />

            <Field
                label="Slug"
                value={values.slug}
                onChangeText={(value) =>
                    updateField("slug", value)
                }
                placeholder="example-perth-band"
                autoCapitalize="none"
            />

            <Field
                label="Hometown"
                value={values.hometown}
                onChangeText={(value) =>
                    updateField("hometown", value)
                }
            />

            <Field
                label="State / Region"
                value={values.stateRegion}
                onChangeText={(value) =>
                    updateField("stateRegion", value)
                }
            />

            <Field
                label="Country"
                value={values.countryCode}
                onChangeText={(value) =>
                    updateField("countryCode", value)
                }
                placeholder="AU"
                autoCapitalize="characters"
            />

            <Field
                label="Member count"
                value={values.memberCount}
                onChangeText={(value) =>
                    updateField("memberCount", value)
                }
                keyboardType="number-pad"
            />

            <Field
                label="Formation year"
                value={values.formationYear}
                onChangeText={(value) =>
                    updateField("formationYear", value)
                }
                keyboardType="number-pad"
            />

            <Field
                label="Genre / description"
                value={values.shortDescription}
                onChangeText={(value) =>
                    updateField(
                        "shortDescription",
                        value
                    )
                }
                placeholder="Indie Rock, Reggae, Alternative"
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
                            "hiatus",
                            "unknown",
                        ] as BandStatus[]
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

            <View style={styles.toggleRow}>
                <View style={styles.toggleItem}>
                    <View style={styles.toggleContent}>
                        <Text style={styles.toggleLabel}>
                            Our Band
                        </Text>

                        <Text style={styles.helperText}>
                            Mark this as your own band.
                        </Text>
                    </View>

                    <Switch
                        value={values.isOurBand}
                        onValueChange={(value) =>
                            updateField("isOurBand", value)
                        }
                    />
                </View>

                <View style={styles.toggleItem}>
                    <View style={styles.toggleContent}>
                        <Text style={styles.toggleLabel}>
                            Verified
                        </Text>

                        <Text style={styles.helperText}>
                            Mark this band research as verified.
                        </Text>
                    </View>

                    <Switch
                        value={values.isVerified}
                        onValueChange={(value) =>
                            updateField("isVerified", value)
                        }
                    />
                </View>
            </View>

            <FormActions
                submitLabel={submitLabel}
                saving={saving}
                onSubmit={() => onSubmit(values)}
            />
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
                placeholderTextColor={
                    colors.textMuted
                }
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