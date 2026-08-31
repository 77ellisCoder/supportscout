import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({

    alignLeft: {
        alignSelf: "flex-start",
    },

    alignCenter: {
        alignSelf: "center",
    },

    alignRight: {
        alignSelf: "flex-end",
    },

    add: {
        minHeight: 0,

        backgroundColor: colors.primaryMuted,

        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.pill,

        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },

    addText: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
    },

    addPressed: {
        backgroundColor: colors.primary,
    },

    button: {
        alignSelf: "flex-start",

        backgroundColor: colors.primary,

        borderRadius: radius.pill,

        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,

        alignItems: "center",
        justifyContent: "center",
    },

    counter: {
        minHeight: 36,

        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,

        backgroundColor: colors.backgroundDeep,

        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.pill,
    },

    counterText: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
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

    fullWidth: {
        alignSelf: "stretch",
    },

    danger: {
        backgroundColor: colors.danger,
    },

    dangerText: {
        color: colors.white,
    },
});