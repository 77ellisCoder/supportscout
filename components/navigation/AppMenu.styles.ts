import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    shadows,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    menu: {
        width: "100%",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.xl,

        marginBottom: spacing.xl,

        overflow: "hidden",

        ...shadows.card,
    },

    menuItem: {
        minHeight: 64,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },

    menuItemPressed: {
        backgroundColor: colors.surfaceHover,
    },

    menuItemDisabled: {
        minHeight: 64,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,

        borderBottomWidth: 1,
        borderBottomColor: colors.border,

        opacity: 0.55,
    },

    menuTitle: {
        ...typography.body,

        color: colors.text,
        fontWeight: "700",
    },

    menuDescription: {
        ...typography.small,

        color: colors.textMuted,

        marginTop: 2,
    },

    chevron: {
        color: colors.primaryLight,

        fontSize: 26,
        fontWeight: "400",

        marginLeft: spacing.md,
    },

    comingSoon: {
        ...typography.label,

        color: colors.primaryLight,

        fontSize: 8,

        marginLeft: spacing.md,
    },
});