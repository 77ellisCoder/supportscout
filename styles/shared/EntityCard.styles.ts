import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../../theme";

export const entityCardStyles = StyleSheet.create({
    card: {
        width: "100%",

        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.lg,

        flexDirection: "row",
        alignItems: "center",

        cursor: "pointer" as any,

        ...shadows.card,
    },

    cardPressed: {
        backgroundColor: colors.surfaceHover,
        borderColor: colors.primary,
        transform: [{ scale: 0.995 }],
    },

    content: {
        flex: 1,
    },

    headingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },

    name: {
        ...typography.h3,
        color: colors.text,
        flexShrink: 1,
    },

    description: {
        ...typography.small,
        color: colors.primaryLight,
        marginTop: spacing.xs,
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: spacing.sm,
        gap: spacing.xs,
    },

    meta: {
        ...typography.small,
        color: colors.textMuted,
    },

    metaDot: {
        ...typography.small,
        color: colors.textMuted,
    },

    chevron: {
        color: colors.textMuted,
        fontSize: 28,
        marginLeft: spacing.lg,
    },
});