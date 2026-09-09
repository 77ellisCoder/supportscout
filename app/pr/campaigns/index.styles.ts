import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../../theme";

import {
    layout,
} from "../../../styles/shared/layout.styles";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        width: "100%",
        maxWidth: layout.contentMaxWidth,
        alignSelf: "center",
        padding: spacing.lg,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.lg,
        gap: spacing.md,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md,
    },

    title: {
        ...typography.h1,
        color: colors.text,
    },

    subtitle: {
        marginTop: spacing.xs,
        color: colors.textSecondary,
    },

    list: {
        gap: spacing.md,
    },

    card: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.lg,
    },

    cardPressed: {
        backgroundColor: colors.surfaceHover,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: spacing.md,
    },

    cardTitleArea: {
        flex: 1,
    },

    campaignName: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "700",
    },

    subject: {
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },

    statusBadge: {
        backgroundColor: colors.primaryMuted,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },

    statusText: {
        color: colors.primaryLight,
        fontSize: 12,
        fontWeight: "700",
    },

    details: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.lg,
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    detailText: {
        color: colors.textSecondary,
    },

    secondaryText: {
        color: colors.textSecondary,
    },

    error: {
        color: colors.danger,
    },

    empty: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.xl,
        alignItems: "center",
        gap: spacing.md,
    },

    emptyTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: "700",
    },
});