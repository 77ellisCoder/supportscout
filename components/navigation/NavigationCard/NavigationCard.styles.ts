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
        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.lg,

        flexDirection: "row",
        alignItems: "center",

        ...shadows.card,
    },

    cardPressed: {
        backgroundColor: colors.surfaceHover,
        opacity: 0.9,
    },

    icon: {
        width: 44,
        height: 44,

        backgroundColor: colors.primaryMuted,
        borderRadius: radius.md,

        alignItems: "center",
        justifyContent: "center",

        marginRight: spacing.lg,
    },

    iconText: {
        color: colors.primaryLight,
        fontSize: 22,
        fontWeight: "700",
    },

    content: {
        flex: 1,
    },

    title: {
        ...typography.h3,

        color: colors.text,

        fontSize: 17,
        lineHeight: 22,
    },

    description: {
        ...typography.small,

        color: colors.textSecondary,
        marginTop: spacing.xs,
    },

    chevron: {
        color: colors.textMuted,
        fontSize: 28,
        marginLeft: spacing.md,
    },
});