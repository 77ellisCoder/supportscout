import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../theme";

export const styles =
    StyleSheet.create({
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
            textAlign: "center",
        },

        header: {
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",

            gap: spacing.lg,

            marginBottom: spacing.xxl,
        },

        headerText: {
            flex: 1,
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

        

        gigList: {
            gap: spacing.md,
        },

        gigCard: {
            width: "100%",

            backgroundColor: colors.surface,

            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.lg,

            padding: spacing.lg,

            flexDirection: "row",
            alignItems: "center",

            ...shadows.card,
        },

        gigCardPressed: {
            backgroundColor: colors.surfaceHover,
            borderColor: colors.primary,

            transform: [
                {
                    scale: 0.995,
                },
            ],
        },

        gigContent: {
            flex: 1,
        },

        gigDate: {
            ...typography.label,

            color: colors.primaryLight,

            marginBottom: spacing.xs,
        },

        gigTitle: {
            ...typography.h3,

            color: colors.text,
        },

        metaRow: {
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",

            gap: spacing.xs,

            marginTop: spacing.sm,
        },

        meta: {
            ...typography.small,

            color: colors.textMuted,
        },

        metaDot: {
            ...typography.small,

            color: colors.textMuted,
        },

        chevron: {
            color: colors.textMuted,

            fontSize: 28,

            marginLeft: spacing.lg,
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
    });