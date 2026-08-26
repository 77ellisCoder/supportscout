import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    container: {
        marginTop: spacing.sm,

        backgroundColor: colors.backgroundDeep,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.md,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        gap: spacing.lg,
    },

    content: {
        flex: 1,
        minWidth: 0,
    },

    title: {
        ...typography.label,

        color: colors.primaryLight,

        fontWeight: "700",
        letterSpacing: 1,
    },

    summary: {
        ...typography.small,

        color: colors.textMuted,

        marginTop: spacing.xs,
    },

    controls: {
        flexDirection: "row",
        alignItems: "center",

        gap: spacing.sm,
    },

    button: {
        width: 38,
        height: 38,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: colors.primaryMuted,

        borderWidth: 1,
        borderColor: colors.primary,

        borderRadius: radius.pill,
    },

    buttonPressed: {
        backgroundColor: colors.surfaceHover,

        transform: [
            {
                scale: 0.96,
            },
        ],
    },

    buttonDisabled: {
        backgroundColor: colors.surface,
        borderColor: colors.border,

        opacity: 0.4,
    },

    buttonText: {
        color: colors.primaryLight,

        fontSize: 22,
        fontWeight: "700",
        lineHeight: 24,
    },

    buttonTextDisabled: {
        color: colors.textMuted,
    },

    countContainer: {
        minWidth: 48,

        alignItems: "center",
        justifyContent: "center",
    },

    count: {
        color: colors.text,

        fontSize: 18,
        fontWeight: "700",
    },

    countLabel: {
        ...typography.small,

        color: colors.textMuted,

        fontSize: 8,
        fontWeight: "700",
    },

    helper: {
        ...typography.small,

        color: colors.textMuted,

        marginTop: spacing.sm,
    },
});