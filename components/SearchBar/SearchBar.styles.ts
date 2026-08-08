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
        paddingHorizontal: spacing.lg,
    },

    input: {
        ...typography.body,
        color: colors.text,
        paddingVertical: spacing.md,
        outlineStyle: "none" as any,
    },
});