import { StyleSheet } from "react-native";

import {
    colors,
    spacing,
    typography,
} from "../../theme";

export const textStyles = StyleSheet.create({
    description: {
        ...typography.small,
        marginTop: spacing.sm,
        marginBottom: spacing.sm,
    },

    body: {
        color: colors.text,
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight,
    },

    muted: {
        color: colors.textMuted,
        fontSize: typography.small.fontSize,
        lineHeight: typography.small.lineHeight,
    },

    sectionLabel: {
        color: colors.textMuted,
        fontSize: typography.label.fontSize,
        fontWeight: typography.label.fontWeight,
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
});