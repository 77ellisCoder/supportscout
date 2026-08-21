import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../theme";

export const styles =
    StyleSheet.create({
        sectionLabel: {
            ...typography.label,
            color: colors.textMuted,
            marginBottom: spacing.md,
        },

        lineup: {
            gap: spacing.md,
            marginBottom: spacing.xl,
        },

        lineupCard: {
            backgroundColor:
                colors.surface,

            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: radius.lg,

            padding: spacing.lg,
        },

        lineupHeader: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.md,
        },

        orderBadge: {
            width: 30,
            height: 30,

            borderRadius: radius.pill,

            backgroundColor:
                colors.primaryMuted,

            alignItems: "center",
            justifyContent: "center",
        },

        orderText: {
            ...typography.small,

            color:
                colors.primaryLight,

            fontWeight: "700",
        },

        bandName: {
            ...typography.h3,

            color: colors.text,

            flex: 1,
        },

        orderControls: {
            flexDirection: "row",
            gap: spacing.xs,
        },

        orderButton: {
            width: 34,
            height: 34,

            alignItems: "center",
            justifyContent: "center",

            borderWidth: 1,
            borderColor:
                colors.border,

            borderRadius: radius.md,

            backgroundColor:
                colors.backgroundDeep,
        },

        orderButtonText: {
            color:
                colors.primaryLight,

            fontSize: 18,
            fontWeight: "700",
        },

        roleRow: {
            flexDirection: "row",
            flexWrap: "wrap",

            gap: spacing.sm,

            marginTop: spacing.md,
            marginBottom: spacing.md,
        },

        roleChip: {
            paddingHorizontal:
                spacing.md,
            paddingVertical:
                spacing.sm,

            borderWidth: 1,
            borderColor:
                colors.border,

            borderRadius: radius.pill,

            backgroundColor:
                colors.backgroundDeep,
        },

        roleChipSelected: {
            borderColor:
                colors.primary,

            backgroundColor:
                colors.primaryMuted,
        },

        roleText: {
            ...typography.small,
            color: colors.textMuted,
        },

        roleTextSelected: {
            color:
                colors.primaryLight,

            fontWeight: "700",
        },

        removeText: {
            ...typography.small,

            color: colors.danger,

            fontWeight: "600",
        },

        emptyState: {
            borderWidth: 1,
            borderColor:
                colors.border,

            borderRadius: radius.lg,

            padding: spacing.lg,

            marginBottom: spacing.xl,
        },

        emptyText: {
            ...typography.small,
            color: colors.textMuted,
        },

        availableLabel: {
            ...typography.label,

            color: colors.textMuted,

            marginBottom: spacing.sm,
        },

        availableBands: {
            flexDirection: "row",
            flexWrap: "wrap",

            gap: spacing.sm,

            marginBottom: spacing.xl,
        },

        addBandChip: {
            paddingHorizontal:
                spacing.md,

            paddingVertical:
                spacing.sm,

            borderWidth: 1,
            borderColor:
                colors.border,

            borderRadius: radius.pill,

            backgroundColor:
                colors.surface,
        },

        addBandText: {
            ...typography.small,

            color:
                colors.primaryLight,

            fontWeight: "600",
        },

        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: spacing.md,
            marginBottom: spacing.md,
        },

        sectionHint: {
            ...typography.small,
            color: colors.textMuted,
            fontSize: 11,
        },

        bandContent: {
            flex: 1,
        },

        currentRole: {
            ...typography.label,
            color: colors.primaryLight,
            fontSize: 9,
            marginTop: 2,
        },

        orderButtonPressed: {
            borderColor: colors.primary,
            backgroundColor: colors.primaryMuted,
        },

        orderButtonDisabled: {
            opacity: 0.25,
        },

        removeButton: {
            alignSelf: "flex-start",
        },

        addBandChipPressed: {
            borderColor: colors.primary,
            backgroundColor: colors.primaryMuted,
        },
    });