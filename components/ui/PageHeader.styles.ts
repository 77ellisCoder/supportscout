import { StyleSheet } from "react-native";

import {
    colors,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.lg,
    },

    content: {
        flex: 1,
    },

    eyebrow: {
        ...typography.label,
        color: colors.primaryLight,
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

    action: {
        flexShrink: 0,
    },
});