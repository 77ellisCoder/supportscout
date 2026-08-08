import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../../theme";

export const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: colors.backgroundDeep,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.pill,

        paddingLeft: spacing.lg,
        paddingRight: spacing.sm,

        flexDirection: "row",
        alignItems: "center",
    },

    input: {
        ...typography.body,
        color: colors.text,

        flex: 1,
        paddingVertical: spacing.md,

        outlineStyle: "none" as any,
    },

    clearButton: {
        width: 32,
        height: 32,

        borderRadius: radius.pill,
        backgroundColor: colors.surface,

        alignItems: "center",
        justifyContent: "center",
    },

    clearButtonPressed: {
        backgroundColor: colors.surfaceHover,
    },

    clearText: {
        color: colors.textSecondary,
        fontSize: 22,
        lineHeight: 24,
    },
});