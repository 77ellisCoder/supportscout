import { StyleSheet } from "react-native";

import {
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

    title: {
        ...typography.h1,
        flexShrink: 1,
    },

    action: {
        flexShrink: 0,
    },
});