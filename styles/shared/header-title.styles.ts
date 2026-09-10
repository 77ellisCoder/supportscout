import { StyleSheet } from "react-native";

import {
    colors,
    spacing,
} from "../../theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.sm,
    },

    backButton: {
        alignItems: "center",
        justifyContent: "center",
    },

    backButtonPressed: {
        opacity: 0.7,
    },

    backText: {
        color: colors.primaryLight,
        fontSize: 30,
        lineHeight: 30,
        fontWeight: "500",
    },

    title: {
        color: colors.text,
        fontSize: 17,
        fontWeight: "600",
    },
});