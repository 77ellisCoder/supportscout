import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../theme";

export const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: colors.background,
    },

    container: {
        width: "100%",
        maxWidth: 900,
        alignSelf: "center",
        padding: spacing.xl,
        paddingBottom: spacing.huge,
    },

    center: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
    },

    loadingText: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },

    errorTitle: {
        ...typography.h3,
        color: colors.text,
    },

    errorText: {
        ...typography.body,
        color: colors.danger,
        marginTop: spacing.sm,
    },

    hero: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginBottom: spacing.xl,
        ...shadows.card,
    },

    eyebrow: {
        ...typography.label,
        color: colors.primaryLight,
        marginBottom: spacing.sm,
    },

    date: {
        ...typography.small,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },

    title: {
        ...typography.h1,
        color: colors.text,
    },

    metaRow: {
        marginTop: spacing.lg,
    },

    meta: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
    },

    section: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        padding: spacing.xl,
        marginBottom: spacing.lg,
    },

    sectionLabel: {
        ...typography.label,
        color: colors.textMuted,
        marginBottom: spacing.md,
    },

    bodyText: {
        ...typography.body,
        color: colors.textSecondary,
    },

    actions: {
        marginTop: spacing.sm,
    },

    editButton: {
        alignSelf: "flex-start",
        backgroundColor: colors.primary,
        borderRadius: radius.pill,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },

    editButtonPressed: {
        opacity: 0.9,
    },

    editButtonText: {
        color: colors.white,
        fontWeight: "700",
        fontSize: 16,
    },

    backButton: {
        alignSelf: "flex-start",
        marginBottom: spacing.lg,
        paddingVertical: spacing.xs,
    },

    backButtonPressed: {
        opacity: 0.6,
    },

    backButtonText: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
    },

    linkTitle: {
        ...typography.h3,
        color: colors.primaryLight,
    },

    lineup: {
        gap: spacing.sm,
    },

    lineupRow: {
        flexDirection: "row",
        alignItems: "center",

        paddingVertical: spacing.sm,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    lineupRowPressed: {
        opacity: 0.7,
    },

    billingOrder: {
        width: 30,
        height: 30,

        borderRadius: radius.pill,
        backgroundColor: colors.primaryMuted,

        alignItems: "center",
        justifyContent: "center",

        marginRight: spacing.md,
    },

    billingOrderText: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
    },

    lineupContent: {
        flex: 1,
    },

    bandRole: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },

    chevron: {
        color: colors.textMuted,
        fontSize: 24,
        marginLeft: spacing.md,
    },
});