import { StyleSheet } from "react-native";

import { spacing } from "../../theme";

export const styles = StyleSheet.create({
    container: {
        width: "100%",

        flexDirection: "row",
        alignItems: "center",

        gap: spacing.md,

        marginTop: spacing.lg,
    },
});