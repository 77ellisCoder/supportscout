import { StyleSheet } from "react-native";

import { colors, radius, spacing, typography } from "../theme";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.xl,
        backgroundColor: colors.background,
    },
    loadingText: {
        ...typography.small,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    textArea: {
        ...typography.body,
        minHeight: 150,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        color: colors.text,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
    },
    pressReleaseInput: {
        minHeight: 220,
    },
    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        marginTop: spacing.sm,
        paddingLeft: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
    },
    fileInfo: {
        flex: 1,
        minWidth: 0,
    },
    fileName: {
        ...typography.small,
        color: colors.text,
    },
    fileSize: {
        ...typography.small,
        color: colors.textMuted,
    },
    helperText: {
        ...typography.small,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    errorText: {
        ...typography.small,
        color: colors.danger,
        marginTop: spacing.sm,
    },
    successText: {
        ...typography.small,
        color: colors.primaryLight,
        marginTop: spacing.sm,
    },
});