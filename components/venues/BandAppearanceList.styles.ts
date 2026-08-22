import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    list: {
        gap: spacing.sm,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: colors.backgroundDeep,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.md,
    },

    rowPressed: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceHover,
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    name: {
        ...typography.h3,
        color: colors.text,
    },

    description: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },

    appearance: {
        alignItems: "center",
        justifyContent: "center",

        minWidth: 48,

        marginLeft: spacing.md,
    },

    count: {
        color: colors.primaryLight,
        fontSize: 16,
        fontWeight: "700",
    },

    countLabel: {
        ...typography.small,
        color: colors.textMuted,
        fontSize: 9,
    },

    chevron: {
        color: colors.textMuted,
        fontSize: 26,
        marginLeft: spacing.sm,
    },
});