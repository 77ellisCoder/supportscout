import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../../theme";
import { textStyles } from "../../styles/shared/typography";

export const styles = StyleSheet.create({
    name: {
        ...typography.h3,
        color: colors.text,
        flexShrink: 1,
    },

    description: {
        ...textStyles.description,
        color: colors.textSecondary,
    },

    scoreBadge: {
        minWidth: 38,
        height: 28,

        paddingHorizontal: spacing.sm,

        borderRadius: radius.pill,
        backgroundColor: colors.primaryMuted,

        alignItems: "center",
        justifyContent: "center",
    },

    score: {
        color: colors.primaryLight,
        fontSize: 13,
        fontWeight: "700",
    },
});