import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../theme";

export const styles = StyleSheet.create({

    resultHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.md,
    },

    addButton: {
        backgroundColor: colors.primaryMuted,

        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.pill,

        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },

    addButtonPressed: {
        backgroundColor: colors.primary,
    },

    addButtonText: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
    },

    sortRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: spacing.sm,
        marginTop: spacing.lg,
    },

    sortLabel: {
        ...typography.label,
        color: colors.textMuted,
        marginRight: spacing.xs,
    },

    chipRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
        marginTop: spacing.lg,
    },

    page: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.xl,
    },

    header: {
        marginBottom: spacing.xl,
    },

    eyebrow: {
        ...typography.label,
        color: colors.primaryLight,
        marginBottom: spacing.sm,
    },

    title: {
        ...typography.h1,
        color: colors.text,
    },

    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },



    resultCount: {
        ...typography.small,
        color: colors.textMuted,
    },

    list: {
        gap: spacing.md,
        paddingBottom: spacing.huge,
    },

    center: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: spacing.xxxl,
    },

    loadingText: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },

    errorText: {
        ...typography.body,
        color: colors.danger,
    },

    emptyTitle: {
        ...typography.h3,
        color: colors.text,
    },

    emptyText: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.sm,
    },
});