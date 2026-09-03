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
import { BandContactLinks } from "./BandContactLinks";
import { GenreChipSelector } from "./GenreChipSelector";
import { useGenres } from "../../hooks/useGenres";

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
    bookingContactName: string;
    contactEmail: string;
    facebookUrl: string;
    instagramUrl: string;
    websiteUrl: string;

    genreIds: number[];
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
    bookingContactName: "",
    contactEmail: "",
    facebookUrl: "",
    instagramUrl: "",
    websiteUrl: "",
    genreIds: [] as number[],
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

    const { data: genres = [] } = useGenres();

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

            <View style={styles.formRow}>
                <View style={styles.formColumn}>
                    <Field
                        label="Band name"
                        value={values.bandName}
                        onChangeText={(value) =>
                            updateField("bandName", value)
                        }
                    />
                </View>

                <View style={styles.formColumn}>
                    <Field
                        label="Slug"
                        value={values.slug}
                        onChangeText={(value) =>
                            updateField("slug", value)
                        }
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formColumn}>
                    <Field
                        label="Hometown"
                        value={values.hometown}
                        onChangeText={(value) =>
                            updateField("hometown", value)
                        }
                    />
                </View>

                <View style={styles.formColumn}>
                    <Field
                        label="State / Region"
                        value={values.stateRegion}
                        onChangeText={(value) =>
                            updateField("stateRegion", value)
                        }
                    />
                </View>

                <View style={styles.formColumnSmall}>
                    <Field
                        label="Country"
                        value={values.countryCode}
                        onChangeText={(value) =>
                            updateField("countryCode", value)
                        }
                    />
                </View>
            </View>

            <View style={styles.formRow}>
                <View style={styles.formColumn}>
                    <Field
                        label="Member count"
                        value={values.memberCount}
                        onChangeText={(value) =>
                            updateField("memberCount", value)
                        }
                        keyboardType="number-pad"
                    />
                </View>

                <View style={styles.formColumn}>
                    <Field
                        label="Formation year"
                        value={values.formationYear}
                        onChangeText={(value) =>
                            updateField("formationYear", value)
                        }
                        keyboardType="number-pad"
                    />
                </View>
            </View>

            <Field
                label="Description"
                value={values.shortDescription}
                onChangeText={(value) =>
                    updateField(
                        "shortDescription",
                        value
                    )
                }
                placeholder="Describe the band..."
                multiline
                numberOfLines={5}
            />

            <View style={styles.section}>
                <Text style={styles.fieldLabel}>
                    Genre(s)
                </Text>
                <GenreChipSelector
                    genres={genres}
                    selectedGenreIds={values.genreIds}
                    onChange={(genreIds) =>
                        updateField("genreIds", genreIds)
                    }
                />
            </View>

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

            <View style={styles.section}>
                {/* Additional fields for booking contact and social media URLs */}
                <BandContactLinks
                    values={values}
                    onChange={updateField}
                />
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
    numberOfLines?: number;
};

function Field({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType,
    autoCapitalize,
    numberOfLines,
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
                numberOfLines={numberOfLines}
            />
        </View>
    );
}