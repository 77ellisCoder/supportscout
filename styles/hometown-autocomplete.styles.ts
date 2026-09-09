import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../theme";

export const styles = StyleSheet.create({
    field: {
        position: "relative",
        marginBottom: spacing.lg,
        zIndex: 100,
    },

    label: {
        ...typography.small,
        color: colors.textSecondary,
        fontWeight: "700",
        marginBottom: spacing.sm,
    },

    input: {
        ...typography.body,
        color: colors.text,
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },

    dropdown: {
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

    dropdownScroll: {
        maxHeight: 260,
    },

    option: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    optionText: {
        ...typography.body,
        color: colors.textSecondary,
    },
});