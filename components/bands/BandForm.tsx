import { useEffect, useState } from "react";

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
import { Genre } from "../../models/Genre";
import { HometownAutocomplete } from "./HometownAutocomplete"

import { ScreenActionBar } from "../ui/ScreenActionBar";

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

    genres: Genre[];
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
    stateRegion: "WA",
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
    genres: [] as Genre[],
};

const MEMBER_COUNT_OPTIONS = Array.from(
    { length: 10 },
    (_, index) => {
        const value = String(index + 1);

        return {
            label: value,
            value,
        };
    }
);

const CURRENT_YEAR = new Date().getFullYear();

const FORMATION_YEAR_OPTIONS = Array.from(
    { length: CURRENT_YEAR - 1949 },
    (_, index) => {
        const value = String(CURRENT_YEAR - index);

        return {
            label: value,
            value,
        };
    }
);

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

    const {
        data: genres = [],
        isLoading: genresLoading,
        error: genresError,
    } = useGenres();

    const [selectedGenreIds, setSelectedGenreIds] =
        useState<number[]>([]);

    const [genresExpanded, setGenresExpanded] = useState(false);

    useEffect(() => {
        if (!values.genres || values.genres.length === 0) {
            return;
        }

        setSelectedGenreIds(
            values.genres?.map((genre) => genre.id) ?? []
        );
    }, [values.genres]);

    return (
        <View style={styles.screen}>
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
                    label="Band name"
                    value={values.bandName}
                    onChangeText={(value) => {
                        updateField("bandName", value);
                        updateField("slug", slugify(value));
                    }}
                />

                <Field
                    label="Slug"
                    value={values.slug}
                    onChangeText={() => { }}
                    autoCapitalize="none"
                    editable={false}
                />

                <View style={[styles.formRow, styles.hometownRow]}>
                    <View style={styles.formColumn}>
                        <HometownAutocomplete
                            value={values.hometown}
                            onChange={(value) =>
                                updateField("hometown", value)
                            }
                        />
                    </View>

                    <View style={styles.formColumn}>
                        <Field
                            label="State / Region"
                            value={values.stateRegion}
                            onChangeText={() => { }}
                            editable={false}
                        />
                    </View>

                    <View style={styles.formColumnSmall}>
                        <Field
                            label="Country"
                            value={values.countryCode}
                            onChangeText={() => { }}
                            editable={false}
                        />
                    </View>
                </View>

                <View style={[styles.formRow, styles.selectRow]}>
                    <View style={styles.formColumn}>
                        <SelectField
                            label="Member count"
                            value={values.memberCount}
                            options={MEMBER_COUNT_OPTIONS}
                            onChange={(value) =>
                                updateField("memberCount", value)
                            }
                        />
                    </View>

                    <View style={styles.formColumn}>
                        <SelectField
                            label="Formation year"
                            value={values.formationYear}
                            options={FORMATION_YEAR_OPTIONS}
                            onChange={(value) =>
                                updateField("formationYear", value)
                            }
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
                    <View style={styles.genreHeader}>
                        <Text style={styles.fieldLabel}>
                            Genre(s)
                        </Text>

                        <Pressable
                            onPress={() =>
                                setGenresExpanded(
                                    (current) => !current
                                )
                            }
                        >
                            <Text style={styles.genreToggleText}>
                                {genresExpanded
                                    ? "Done"
                                    : "Edit Genres"}
                            </Text>
                        </Pressable>
                    </View>

                    {selectedGenreIds.length > 0 && (
                        <GenreChipSelector
                            genres={genres.filter((genre) =>
                                selectedGenreIds.includes(
                                    genre.id
                                )
                            )}
                            selectedGenreIds={
                                selectedGenreIds
                            }
                            onChange={() => { }}
                            readOnly
                        />
                    )}

                    {selectedGenreIds.length === 0 &&
                        !genresExpanded && (
                            <Text style={styles.genreEmptyText}>
                                No genres selected.
                            </Text>
                        )}

                    {genresExpanded && (
                        <View style={styles.genreEditor}>
                            <GenreChipSelector
                                genres={genres}
                                selectedGenreIds={
                                    selectedGenreIds
                                }
                                onChange={(ids) => {
                                    setSelectedGenreIds(ids);

                                    updateField(
                                        "genres",
                                        genres.filter(
                                            (genre) =>
                                                ids.includes(
                                                    genre.id
                                                )
                                        )
                                    );
                                }}
                            />
                        </View>
                    )}
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
            </ScrollView>
            
            <ScreenActionBar>
                <FormActions
                    submitLabel={submitLabel}
                    saving={saving}
                    onSubmit={() => onSubmit(values)}
                    inActionBar
                />
            </ScreenActionBar>
        </View>
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
    editable?: boolean;
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
    editable = true,
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
                editable={editable}
                style={[
                    styles.input,
                    multiline && styles.textArea,
                ]}
                numberOfLines={numberOfLines}
            />
        </View>
    );
}

type SelectOption = {
    label: string;
    value: string;
};

type SelectFieldProps = {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
};

function SelectField({
    label,
    value,
    options,
    onChange,
}: SelectFieldProps) {
    const [open, setOpen] = useState(false);

    const selected = options.find(
        (option) => option.value === value
    );

    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>
                {label}
            </Text>

            <Pressable
                style={styles.select}
                onPress={() => setOpen((current) => !current)}
            >
                <Text
                    style={
                        selected
                            ? styles.selectText
                            : styles.selectPlaceholder
                    }
                >
                    {selected?.label ?? "Select..."}
                </Text>

                <Text style={styles.selectArrow}>
                    {open ? "▲" : "▼"}
                </Text>
            </Pressable>

            {open && (
                <View style={styles.selectOptions}>
                    <ScrollView
                        style={styles.selectOptionsScroll}
                        nestedScrollEnabled
                        showsVerticalScrollIndicator
                    >
                        {options.map((option) => (
                            <Pressable
                                key={option.value}
                                style={[
                                    styles.selectOption,
                                    value === option.value &&
                                    styles.selectOptionSelected,
                                ]}
                                onPress={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.selectOptionText,
                                        value === option.value &&
                                        styles.selectOptionTextSelected,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

function slugify(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}