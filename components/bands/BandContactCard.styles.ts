import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    card: {
        width: "100%",

        padding: spacing.lg,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        marginBottom: spacing.lg,
    },

    heading: {
        ...typography.label,
        color: colors.textMuted,

        marginBottom: spacing.md,
    },

    content: {
        gap: spacing.xs,
    },

    row: {
        minHeight: 52,

        flexDirection: "row",
        alignItems: "center",

        gap: spacing.md,

        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,

        borderRadius: radius.md,
    },

    rowPressed: {
        backgroundColor: colors.surfaceHover,
    },

    icon: {
        width: 28,

        alignItems: "center",
        justifyContent: "center",
    },

    rowContent: {
        flex: 1,
    },

    label: {
        ...typography.small,
        color: colors.textMuted,
    },

    value: {
        ...typography.body,
        color: colors.text,
    },

    link: {
        ...typography.body,
        color: colors.primaryLight,
    },
});