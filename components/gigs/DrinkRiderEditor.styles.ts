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

        width: "100%",
    },

    content: {
        width: "100%",
        minWidth: 0,
    },

    title: {
        ...typography.label,

        color: colors.primaryLight,

        fontWeight: "700",
        letterSpacing: 1,

        flexShrink: 1,
    },

    summary: {
        ...typography.small,

        color: colors.textMuted,

        marginTop: spacing.xs,

        flexShrink: 1,
    },

    helper: {
        ...typography.small,

        color: colors.textMuted,

        marginTop: spacing.xs,

        fontSize: 12,

        flexShrink: 1,
    },

    controlsRow: {
        marginTop: spacing.md,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        gap: spacing.sm,

        width: "100%",
    },

    controlLabel: {
        ...typography.small,

        color: colors.textSecondary,

        fontWeight: "600",
    },

    controls: {
        flexDirection: "row",
        alignItems: "center",

        gap: spacing.sm,

        flexShrink: 0,
    },

    countContainer: {
        minWidth: 44,

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
});