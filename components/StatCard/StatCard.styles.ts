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
        minWidth: 180,
        flexGrow: 1,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.xl,

        padding: spacing.xl,

        ...shadows.card,
    },

    cardPressed: {
        borderColor: colors.primary,
        transform: [{ scale: 0.98 }],
    },

    label: {
        ...typography.label,
        color: colors.textMuted,
    },

    valueContainer: {
        height: 58,
        alignItems: "flex-start",
        justifyContent: "center",
    },

    value: {
        fontSize: 42,
        fontWeight: "700",
        marginTop: spacing.sm,
    },

    valueHighlighted: {
        color: colors.primaryLight,
    },

    valueMuted: {
        color: colors.textMuted,
    },

    caption: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
});