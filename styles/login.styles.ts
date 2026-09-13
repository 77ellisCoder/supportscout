import {
    StyleSheet,
} from "react-native";

import {
    colors,
} from "../theme";

export const styles =
    StyleSheet.create({
        container: {
            flex: 1,

            backgroundColor:
                colors.background,

            alignItems:
                "center",

            justifyContent:
                "center",

            padding: 24,
        },

        card: {
            width: "100%",

            maxWidth: 430,

            padding: 24,

            borderRadius: 16,

            borderWidth: 1,

            borderColor:
                colors.border,

            backgroundColor:
                colors.surface,

            gap: 20,
        },

        heading: {
            gap: 6,
        },

        title: {
            color:
                colors.text,

            fontSize: 28,

            fontWeight:
                "700",
        },

        subtitle: {
            color:
                colors.textSecondary,

            fontSize: 14,
        },

        form: {
            gap: 16,
        },

        field: {
            gap: 6,
        },

        label: {
            color:
                colors.textSecondary,

            fontSize: 12,

            fontWeight:
                "600",
        },

        input: {
            minHeight: 44,

            paddingHorizontal: 12,

            borderWidth: 1,

            borderColor:
                colors.border,

            borderRadius: 9,

            color:
                colors.text,

            backgroundColor:
                colors.background,
        },

        error: {
            color:
                colors.danger,

            fontSize: 13,
        },
    });