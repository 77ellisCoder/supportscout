import { StyleSheet } from "react-native";

import { colors, radius, spacing, typography } from "../theme";
import { formStyles } from "./shared/forms.styles";

const bandFormOverrides = StyleSheet.create({
    container: {
        paddingBottom: spacing.huge,
    },

    formRow: {
        flexWrap: "wrap",
    },

    formColumn: {
        minWidth: 220,
    },

    formColumnSmall: {
        minWidth: 120,
        flex: 0.5,
    },

    section: {
        marginBottom: spacing.lg,
    },

    toggleRow: {
        flexWrap: "wrap",
    },

    toggleItem: {
        minWidth: 220,
    },

    select: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },

    selectText: {
        ...typography.body,
        color: colors.text,
    },

    selectPlaceholder: {
        ...typography.body,
        color: colors.textMuted,
    },

    selectArrow: {
        ...typography.small,
        color: colors.primaryLight,
    },

    selectOption: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    selectOptionSelected: {
        backgroundColor: colors.primaryMuted,
    },

    selectOptionText: {
        ...typography.body,
        color: colors.textSecondary,
    },

    selectOptionTextSelected: {
        color: colors.primaryLight,
        fontWeight: "700",
    },

    selectField: {
        position: "relative",
        zIndex: 100,
    },

    selectOptions: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,

        marginTop: spacing.xs,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        overflow: "hidden",

        zIndex: 1000,
        elevation: 20,
    },

    selectOptionsScroll: {
        maxHeight: 260,
    },

    selectRow: {
        position: "relative",
        zIndex: 100,
    },

    genreHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.sm,
    },

    genreToggleText: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
    },

    genreEditor: {
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    genreEmptyText: {
        ...typography.small,
        color: colors.textMuted,
    },
});

export const styles = {
    ...formStyles,

    container: [
        formStyles.container,
        bandFormOverrides.container,
    ],

    formRow: [
        formStyles.formRow,
        bandFormOverrides.formRow,
    ],

    formColumn: [
        formStyles.formColumn,
        bandFormOverrides.formColumn,
    ],

    formColumnSmall: [
        formStyles.formColumnSmall,
        bandFormOverrides.formColumnSmall,
    ],

    section: [
        formStyles.section,
        bandFormOverrides.section,
    ],

    toggleRow: [
        formStyles.toggleRow,
        bandFormOverrides.toggleRow,
    ],

    toggleItem: [
        formStyles.toggleItem,
        bandFormOverrides.toggleItem,
    ],

    select: bandFormOverrides.select,
    selectText: bandFormOverrides.selectText,
    selectPlaceholder:
        bandFormOverrides.selectPlaceholder,
    selectArrow: bandFormOverrides.selectArrow,
    selectOptions: bandFormOverrides.selectOptions,
    selectOption: bandFormOverrides.selectOption,
    selectOptionSelected:
        bandFormOverrides.selectOptionSelected,
    selectOptionText:
        bandFormOverrides.selectOptionText,
    selectOptionTextSelected:
        bandFormOverrides.selectOptionTextSelected,
    selectField: bandFormOverrides.selectField,
    selectOptionsScroll:
        bandFormOverrides.selectOptionsScroll,
    selectRow: bandFormOverrides.selectRow,
    genreHeader: bandFormOverrides.genreHeader,
    genreToggleText: bandFormOverrides.genreToggleText,
    genreEditor: bandFormOverrides.genreEditor,
    genreEmptyText: bandFormOverrides.genreEmptyText,
};