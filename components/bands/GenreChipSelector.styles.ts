import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    chips: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },

    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.pill,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    chipSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted,
    },

    chipText: {
        ...typography.small,
        color: colors.textSecondary,
    },

    chipTextSelected: {
        color: colors.primaryLight,
        fontWeight: "700",
    },
});