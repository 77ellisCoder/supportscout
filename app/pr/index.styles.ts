import { StyleSheet } from "react-native";

import { colors, radius, spacing, typography } from "../../theme";
import { layout } from "../../styles/shared/layout.styles";

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
        marginBottom: spacing.lg,
    },

    title: {
        ...typography.h1,
        color: colors.text,
    },

    stats: {
        marginTop: spacing.xs,
        color: colors.textSecondary,
    },

    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
        marginBottom: spacing.md,
        flexWrap: "wrap",
    },

    searchInput: {
        flexGrow: 1,
        minWidth: 260,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.text,
    },

    filterButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },

    filterButtonSelected: {
        backgroundColor: colors.primaryMuted,
        borderColor: colors.primary,
    },

    filterText: {
        color: colors.textSecondary,
    },

    filterTextSelected: {
        color: colors.text,
    },

    table: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        overflow: "hidden",
        backgroundColor: colors.surface,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 54,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: spacing.sm,
    },

    headerRow: {
        backgroundColor: colors.backgroundDeep,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },

    headerTitle: {
        flex: 1,
    },

    checkbox: {
        width: 42,
    },

    outlet: {
        flex: 1.4,
        paddingRight: spacing.sm,
    },

    contact: {
        flex: 1.3,
        paddingRight: spacing.sm,
    },

    email: {
        flex: 1.7,
        paddingRight: spacing.sm,
    },

    location: {
        flex: 1,
        paddingRight: spacing.sm,
    },

    method: {
        width: 90,
    },

    headerText: {
        ...typography.label,
        color: colors.textSecondary,
    },

    primaryText: {
        color: colors.text,
    },

    secondaryText: {
        color: colors.textSecondary,
    },

    checkboxBox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },

    checkboxSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },

    checkboxTick: {
        color: colors.white,
        fontSize: 12,
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: spacing.md,
    },

    footerText: {
        color: colors.textSecondary,
    },

    empty: {
        padding: spacing.xl,
        alignItems: "center",
    },

    emptyText: {
        color: colors.textSecondary,
    },

    footerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
    },

    createButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
    },

    createButtonDisabled: {
        opacity: 0.4,
    },

    createButtonText: {
        color: colors.white,
        fontWeight: "600",
    },

    selectAllButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
    },

    selectAllButtonText: {
        color: colors.primaryLight,
        fontWeight: "600",
    },

    pagination: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: spacing.md,
        marginTop: spacing.md,
    },

    pageSizeControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    pageControls: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    pageSizeButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: radius.md,
    },

    pageSizeButtonSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted,
    },

    pageSizeText: {
        color: colors.textSecondary,
    },

    pageSizeTextSelected: {
        color: colors.text,
        fontWeight: "600",
    },

    pageButton: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
    },

    pageButtonDisabled: {
        opacity: 0.35,
    },

    pageButtonText: {
        color: colors.primaryLight,
        fontWeight: "600",
    },
});