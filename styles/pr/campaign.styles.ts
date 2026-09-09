import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

import {
    layout,
} from "../shared/layout.styles";

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
        gap: spacing.lg,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    title: {
        ...typography.h1,
        color: colors.text,
    },

    statusBadge: {
        backgroundColor:
            colors.primaryMuted,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
    },

    statusText: {
        color: colors.primaryLight,
        fontWeight: "700",
        fontSize: 12,
    },

    section: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: spacing.lg,
        gap: spacing.sm,
    },

    sectionTitle: {
        ...typography.label,
        color: colors.text,
    },

    value: {
        color: colors.text,
        fontSize: 16,
    },

    messageText: {
        color: colors.text,
        lineHeight: 22,
        whiteSpace: "pre-wrap",
    } as any,

    secondaryText: {
        color: colors.textSecondary,
    },

    recipientList: {
        marginTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    recipientRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    recipientOutlet: {
        color: colors.text,
        fontWeight: "600",
    },

    recipientStatus: {
        color: colors.textSecondary,
        textTransform: "capitalize",
    },

    testActions: {
        alignItems: "flex-start",
        marginTop: spacing.sm,
    },

    success: {
        color: colors.primaryLight,
        marginTop: spacing.sm,
    },

    error: {
        color: colors.danger,
        marginTop: spacing.sm,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: spacing.sm,
    },
});