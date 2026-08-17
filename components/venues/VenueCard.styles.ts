import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
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