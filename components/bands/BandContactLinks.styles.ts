import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        gap: spacing.lg,

        padding: spacing.lg,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
    },

    heading: {
        ...typography.label,
        color: colors.textMuted,
    },
    
    row: {  
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },
    
    text: {
        ...typography.body,
        color: colors.text,
    },

    section: {
        width: "100%",
        gap: spacing.lg,

        padding: spacing.lg,

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,
    },

    sectionTitle: {
        ...typography.label,
        color: colors.textMuted,
    },

    field: {
        width: "100%",
        gap: spacing.sm,
    },

    label: {
        ...typography.small,
        color: colors.text,
        fontWeight: "700",
    },

    input: {
        width: "100%",

        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,

        backgroundColor: colors.backgroundDeep,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,

        color: colors.text,

        ...typography.body,
    },

    link: {
        ...typography.body,
        color: colors.primaryLight,
    },

    rowPressed: {
        opacity: 0.6,
    },
});