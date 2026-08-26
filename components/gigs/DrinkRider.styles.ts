import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    container: {
        marginTop: spacing.md,

        padding: spacing.md,

        backgroundColor: colors.backgroundDeep,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
    },

    title: {
        ...typography.small,

        color: colors.primaryLight,

        fontWeight: "700",
        letterSpacing: 1,
    },

    remaining: {
        ...typography.small,

        color: colors.textMuted,

        marginTop: spacing.xs,
        marginBottom: spacing.md,
    },

    tokens: {
        flexDirection: "row",
        flexWrap: "wrap",

        gap: spacing.sm,
    },

    token: {
        minWidth: 110,
        minHeight: 84,

        flexGrow: 1,
        flexBasis: "45%",

        alignItems: "center",
        justifyContent: "center",

        padding: spacing.md,

        backgroundColor: colors.primaryMuted,

        borderWidth: 1,
        borderColor: colors.primary,

        borderRadius: radius.lg,
    },

    tokenPressed: {
        transform: [
            {
                scale: 0.97,
            },
        ],

        backgroundColor: colors.surfaceHover,
    },

    tokenUsed: {
        backgroundColor: colors.surface,

        borderColor: colors.border,

        opacity: 0.45,
    },

    tokenIcon: {
        fontSize: 28,

        marginBottom: spacing.xs,
    },

    tokenText: {
        ...typography.small,

        color: colors.primaryLight,

        fontWeight: "700",
        letterSpacing: 0.5,
    },

    tokenTextUsed: {
        color: colors.textMuted,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md,
    },

    allocationControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    allocationButton: {
        width: 34,
        height: 34,

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.pill,

        backgroundColor: colors.primaryMuted,
    },

    allocationButtonDisabled: {
        opacity: 0.3,
    },

    allocationButtonText: {
        color: colors.primaryLight,
        fontSize: 20,
        fontWeight: "700",
    },

    allocationCount: {
        color: colors.text,
        fontSize: 16,
        fontWeight: "700",
    },
});