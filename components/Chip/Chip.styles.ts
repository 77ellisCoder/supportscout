import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    chip: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.pill,

        backgroundColor: colors.surface,

        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },



    chipSelected: {
        backgroundColor: colors.primaryMuted,
        borderColor: colors.primary,
    },

    chipPressed: {
        opacity: 0.85,
    },

    text: {
        ...typography.small,
        color: colors.textSecondary,
        fontWeight: "600",
    },

    textSelected: {
        color: colors.primaryLight,
    },
});