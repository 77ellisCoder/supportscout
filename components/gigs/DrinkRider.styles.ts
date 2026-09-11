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

        width: "100%",
    },

    title: {
        ...typography.small,

        color: colors.primaryLight,

        fontWeight: "700",
        letterSpacing: 1,

        flexShrink: 1,
    },

    remaining: {
        ...typography.small,

        color: colors.textMuted,

        marginTop: spacing.xs,
        marginBottom: spacing.sm,
    },

    tokens: {
        flexDirection: "row",
        flexWrap: "wrap",

        gap: spacing.sm,

        width: "100%",
    },

    token: {
        flexBasis: "48%",
        flexGrow: 0,
        flexShrink: 1,

        minWidth: 0,
        minHeight: 64,

        alignItems: "center",
        justifyContent: "center",

        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,

        backgroundColor: colors.primaryMuted,

        borderWidth: 1,
        borderColor: colors.primary,

        borderRadius: radius.md,
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
        fontSize: 22,

        marginBottom: spacing.xs,
    },

    tokenText: {
        ...typography.small,

        color: colors.primaryLight,

        fontWeight: "700",
        letterSpacing: 0.3,

        textAlign: "center",
    },

    tokenTextUsed: {
        color: colors.textMuted,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        gap: spacing.sm,

        width: "100%",
    },

    allocationControls: {
        flexDirection: "row",
        alignItems: "center",

        gap: spacing.xs,

        flexShrink: 0,
    },

    allocationButton: {
        width: 30,
        height: 30,

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

        fontSize: 18,
        fontWeight: "700",
    },

    allocationCount: {
        color: colors.text,

        fontSize: 15,
        fontWeight: "700",

        minWidth: 20,
        textAlign: "center",
    },

    tokenUnavailable: {
        opacity: 0.55,
    },
});