import { StyleSheet } from "react-native";

import { spacing } from "../../theme";

export const layout = {
    contentMaxWidth: 1100,
    formMaxWidth: 800,
};

export const layoutStyles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        width: "100%",
        maxWidth: layout.contentMaxWidth,
        alignSelf: "center",
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.huge,
    },

    formContainer: {
        flexGrow: 1,

        width: "100%",
        maxWidth: layout.formMaxWidth,

        alignSelf: "center",

        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing.huge,
    },

    contentWidth: {
        width: "100%",
        maxWidth: 1100,
        alignSelf: "center",
    },

    formWidth: {
        width: "100%",
        maxWidth: 800,
        alignSelf: "center",
    },

    header: {
        paddingHorizontal: spacing.xl,
        marginBottom: spacing.lg,
        marginTop: spacing.xl,
    },
});