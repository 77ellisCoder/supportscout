import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

import { layoutStyles } from "./layout.styles";

export const finderStyles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.background,
    },

    container: {
        ...layoutStyles.contentContainer,
    },

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

    header: {
        ...layoutStyles.contentWidth,
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.lg,
        marginTop: spacing.xl,
    },

    list: {
        ...layoutStyles.contentWidth,
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.huge,
    },
});