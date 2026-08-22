import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    card: {
        width: "100%",

        flexDirection: "row",
        alignItems: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.lg,

        ...shadows.card,
    },

    cardPressed: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceHover,

        transform: [
            {
                scale: 0.995,
            },
        ],
    },

    dateBadge: {
        width: 56,
        height: 56,

        flexShrink: 0,

        borderRadius: radius.md,

        backgroundColor:
            colors.primaryMuted,

        alignItems: "center",
        justifyContent: "center",

        marginRight: spacing.lg,
    },

    dateDay: {
        color: colors.primaryLight,

        fontSize: 20,
        fontWeight: "700",
    },

    dateMonth: {
        ...typography.small,

        color: colors.textMuted,

        fontSize: 9,
        fontWeight: "700",
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    title: {
        ...typography.h3,
        color: colors.text,
    },

    venue: {
        ...typography.small,

        color: colors.primaryLight,

        marginTop: spacing.xs,
    },

    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",

        gap: spacing.xs,

        marginTop: spacing.xs,
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