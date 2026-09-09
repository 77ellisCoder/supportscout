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
        gap: spacing.lg,
    },

    header: {
        marginBottom: spacing.sm,
    },

    title: {
        ...typography.h1,
        color: colors.text,
    },

    subtitle: {
        marginTop: spacing.xs,
        color: colors.textSecondary,
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
        marginBottom: spacing.xs,
    },

    label: {
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },

    input: {
        backgroundColor: colors.backgroundDeep,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.text,
    },

    messageInput: {
        minHeight: 220,
    },

    placeholder: {
        color: colors.textMuted,
    },

    attachmentRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.md,
    },

    attachmentName: {
        color: colors.text,
        fontWeight: "600",
    },

    secondaryText: {
        color: colors.textSecondary,
    },

    recipientList: {
        marginTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },

    recipientRow: {
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    recipientOutlet: {
        color: colors.text,
        fontWeight: "600",
    },

    error: {
        color: colors.danger,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: spacing.sm,
    },
});