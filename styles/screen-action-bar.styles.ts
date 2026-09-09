import { StyleSheet } from "react-native";

import {
    colors,
    spacing,
} from "../theme";

import { layoutStyles } from "./shared/layout.styles";

export const styles = StyleSheet.create({
    bar: {
        width: "100%",

        backgroundColor: colors.background,

        borderTopWidth: 1,
        borderTopColor: colors.border,

        zIndex: 100,
        elevation: 12,
    },

    content: {
        ...layoutStyles.contentWidth,

        width: "100%",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: spacing.md,

        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
    },
});