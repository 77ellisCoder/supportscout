import { StyleSheet } from "react-native";

import { colors, radius, spacing, typography } from "../theme";
import { layout } from "./shared/layout.styles";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        width: "100%",
        maxWidth: layout.contentMaxWidth,
        alignSelf: "center",
        padding: spacing.xl,
        paddingBottom: spacing.huge,
        gap: spacing.lg,
    },
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
    },
    header: {
        gap: spacing.xs,
    },
    title: {
        ...typography.h1,
        color: colors.text,
    },
    description: {
        ...typography.body,
        color: colors.textSecondary,
    },
    section: {
        padding: spacing.xl,
        gap: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
    },
    sectionTitle: {
        ...typography.label,
        color: colors.textMuted,
    },
    subheading: {
        ...typography.label,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    input: {
        ...typography.body,
        minHeight: 44,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.background,
        color: colors.text,
    },
    list: {
        gap: spacing.sm,
    },
    row: {
        minWidth: 0,
        minHeight: 52,
        padding: spacing.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    userDetails: {
        flex: 1,
        minWidth: 0,
        gap: 2,
    },
    userName: {
        ...typography.body,
        color: colors.text,
        fontWeight: "600",
    },
    secondaryText: {
        ...typography.small,
        color: colors.textSecondary,
    },
    roleText: {
        ...typography.small,
        color: colors.primaryLight,
        textTransform: "uppercase",
    },
    rowActions: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: spacing.xs,
    },
    bandPicker: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    bandOption: {
        minHeight: 36,
        justifyContent: "center",
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        backgroundColor: colors.background,
    },
    bandOptionSelected: {
        borderColor: colors.primaryLight,
        backgroundColor: colors.primaryMuted,
    },
    bandOptionText: {
        ...typography.small,
        color: colors.textSecondary,
    },
    bandOptionTextSelected: {
        color: colors.primaryLight,
        fontWeight: "600",
    },
    empty: {
        ...typography.small,
        color: colors.textSecondary,
    },
    error: {
        ...typography.small,
        color: colors.danger,
    },
});