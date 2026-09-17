import {
    StyleSheet,
} from "react-native";

import {
    layout,
} from "./shared/layout.styles";

export const styles =
    StyleSheet.create({
        container: {
            flexGrow: 1,
            padding: 24,
            gap: 22,
            backgroundColor:
                "#0d0d14",
        },

        header: {
            width: "100%",

            maxWidth: layout.contentMaxWidth,

            alignSelf:
                "center",

            gap: 5,
        },

        title: {
            fontSize: 28,
            fontWeight: "700",
            color: "#ffffff",
        },

        subtitle: {
            fontSize: 14,
            color: "#9b94a8",
        },

        card: {
            width: "100%",
            maxWidth: layout.contentMaxWidth,

            alignSelf:
                "center",


            padding: 18,

            borderWidth: 1,
            borderColor:
                "#2d2738",
            borderRadius: 14,
            backgroundColor:
                "#15121c",
            gap: 14,
        },

        sectionLabel: {
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.8,
            color: "#9b94a8",
        },

        list: {
            gap: 8,
        },

        row: {
            minHeight: 52,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor:
                "#2d2738",
            borderRadius: 10,
            backgroundColor:
                "#1a1722",
            flexDirection: "row",
            alignItems: "center",
            justifyContent:
                "space-between",
            gap: 16,
        },

        bandDetails: {
            flex: 1,
            gap: 3,
        },

        bandName: {
            flex: 1,
            fontSize: 15,
            fontWeight: "600",
            color: "#ffffff",
        },

        relationship: {
            fontSize: 11,
            color: "#b78cff",
            textTransform:
                "uppercase",
        },

        searchInput: {
            width: "100%",
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderWidth: 1,
            borderColor:
                "#3b3b48",
            borderRadius: 10,
            backgroundColor:
                "#252532",
            color: "#ffffff",
            fontSize: 15,
        },

        empty: {
            paddingVertical: 8,
            fontSize: 13,
            color: "#9b94a8",
        },
    });