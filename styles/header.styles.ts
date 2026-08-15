import { StyleSheet } from "react-native";
import {
    colors,
    spacing,
} from "../theme";

export const headerStyles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: spacing.lg,
    },

    menuButton: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
    },

    logoIcon: {
        width: 42,
        height: 42,
    },

    closeIcon: {
        color: colors.primaryLight,
        fontSize: 34,
        lineHeight: 38,
        fontWeight: "300",
    },

    brand: {
        flex: 1,
        alignItems: "center",
    },

    brandName: {
        color: colors.text,
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: -0.8,
    },

    brandAccent: {
        color: colors.primaryLight,
    },

    tagline: {
        color: colors.textMuted,
        fontSize: 7,
        fontWeight: "700",
        letterSpacing: 0.8,
        marginTop: 2,
        textAlign: "center",
    },

    headerSpacer: {
        width: 48,
    },
});