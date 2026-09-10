import { StyleSheet } from "react-native";

import {
    colors,
    spacing,
} from "../../theme";

export const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
    },

    backButton: {
        width: spacing.xxl,
        height: spacing.xxxl,
        alignItems: "center",
        justifyContent: "center",
    },
    backText: {
        color: colors.primaryLight,
        fontSize: spacing.xl,
        fontWeight: "500",
    },

    backButtonPressed: {
        opacity: 0.7,
    },

    title: {
        color: colors.text,
        fontSize: 17,
        fontWeight: "600",
    },
});