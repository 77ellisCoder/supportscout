import { StyleSheet } from "react-native";

import {
    colors,
    spacing,
    typography,
} from "../../theme";

/** Shared shell and content styles for buttons. */
export const buttonStyles = StyleSheet.create({

    backButton: {
        alignSelf: "flex-start",
        marginBottom: spacing.lg,
        paddingVertical: spacing.xs,
    },

    backButtonPressed: {
        opacity: 0.6,
    },

    backButtonText: {
        ...typography.small,
        color: colors.primaryLight,
        fontWeight: "700",
    },
});