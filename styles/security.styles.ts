import {
    StyleSheet,
} from "react-native";

export const styles =
    StyleSheet.create({
        page: {
            flex: 1,
            backgroundColor:
                "#0d0d14",
        },

        container: {
            width: "100%",
            maxWidth: 640,
            alignSelf: "center",
            padding: 24,
        },

        heading: {
            fontSize: 28,
            fontWeight: "700",
            color:
                "#f2f2f7",
            marginBottom: 8,
        },

        description: {
            fontSize: 16,
            lineHeight: 24,
            color:
                "#a7a7b3",
            marginBottom: 24,
        },

        form: {
            backgroundColor:
                "#1a1a24",
            borderWidth: 1,
            borderColor:
                "#2a2a36",
            borderRadius: 18,
            padding: 24,
            gap: 12,
        },

        label: {
            fontSize: 14,
            fontWeight: "600",
            color:
                "#f2f2f7",
        },

        input: {
            borderWidth: 1,
            borderColor:
                "#3b3b48",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 16,
            color:
                "#f2f2f7",
            backgroundColor:
                "#252532",
            marginBottom: 8,
        },

        error: {
            color:
                "#ef5b68",
            fontSize: 14,
            marginBottom: 4,
        },

        success: {
            color:
                "#52d273",
            fontSize: 14,
            marginBottom: 4,
        },
    });