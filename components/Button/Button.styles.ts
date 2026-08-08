import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
} from "../../theme";

export const styles = StyleSheet.create({
    button: {
        minHeight: 58,

        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.lg,

        borderRadius: radius.pill,

        alignItems: "center",
        justifyContent: "center",
    },

    primary: {
        backgroundColor: colors.primary,
        ...shadows.primary,
    },

    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },

    ghost: {
        backgroundColor: "transparent",
    },

    pressed: {
        opacity: 0.9,
        transform: [
            {
                scale: 0.98,
            },
        ],
    },

    disabled: {
        opacity: 0.5,
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.md,
    },

    text: {
        fontSize: 17,
        fontWeight: "700",
    },

    primaryText: {
        color: colors.white,
    },

    secondaryText: {
        color: colors.primaryLight,
    },
});