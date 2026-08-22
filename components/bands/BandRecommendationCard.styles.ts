import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: colors.backgroundDeep,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.md,
    },

    cardPressed: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceHover,
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    bandName: {
        ...typography.h3,
        color: colors.text,
    },

    description: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },

    reasons: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",

        gap: spacing.xs,

        marginTop: spacing.sm,
    },

    reason: {
        ...typography.small,
        color: colors.primaryLight,
    },

    separator: {
        ...typography.small,
        color: colors.textMuted,
    },

    scoreContainer: {
        minWidth: 54,

        alignItems: "center",
        justifyContent: "center",

        marginLeft: spacing.md,
    },

    score: {
        color: colors.primaryLight,

        fontSize: 20,
        fontWeight: "700",
    },

    scoreLabel: {
        ...typography.small,

        color: colors.textMuted,

        fontSize: 8,
        fontWeight: "700",
    },

    chevron: {
        color: colors.textMuted,
        fontSize: 26,

        marginLeft: spacing.sm,
    },
});