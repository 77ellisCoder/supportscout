import { useMemo, useState } from "react";

import {
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { colors } from "../../theme";
import { styles } from "../../styles/gig-form.styles";

import { FormActions } from "../ui/FormActions";
import { FieldLabel } from "../ui/FieldLabel";


export type GenreFormValues = {
    genreName: string;
};

type GenreFormProps = {
    initialValues?: Partial<GenreFormValues>;
    title: string;
    eyebrow: string;
    submitLabel: string;
    saving?: boolean;
    error?: string | null;
    onSubmit: (
        values: GenreFormValues
    ) => Promise<void> | void;
};

const DEFAULT_VALUES: GenreFormValues = {
    genreName: "",
};

export function GenreForm({
    initialValues,
    title,
    eyebrow,
    submitLabel,
    saving = false,
    error,
    onSubmit,
}: GenreFormProps) {
    const [values, setValues] =
        useState<GenreFormValues>({
            ...DEFAULT_VALUES,
            ...initialValues,
        });

    const updateField = <
        K extends keyof GenreFormValues
    >(
        key: K,
        value: GenreFormValues[K]
    ) => {
        setValues((current) => ({
            ...current,
            [key]: value,
        }));
    };

    return (
        <ScrollView
            style={styles.page}
            contentContainerStyle={
                styles.formContainer
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
                label="Genre name"
                required
                value={values.genreName}
                onChangeText={(value) =>
                    updateField(
                        "genreName",
                        value
                    )
                }
                placeholder="Amazing Rock"
            />

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
    required?: boolean;
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
    required = false,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType,
    autoCapitalize,
}: FieldProps) {
    return (
        <View style={styles.field}>
            <FieldLabel
                label={label}
                required={required}
                style={styles.fieldLabel}
            />

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