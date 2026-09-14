import {
    StyleSheet,
} from "react-native";

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
            gap: 5,
        },

        title: {
            fontSize: 28,

            fontWeight:
                "700",

            color:
                "#ffffff",
        },

        subtitle: {
            fontSize: 14,

            color:
                "#9b94a8",
        },

        accountCard: {
            width:
                "100%",

            maxWidth:
                960,

            padding:
                18,

            borderWidth:
                1,

            borderColor:
                "#2d2738",

            borderRadius:
                14,

            backgroundColor:
                "#15121c",

            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "space-between",

            gap:
                20,
        },

        accountDetails: {
            flex:
                1,

            gap:
                3,
        },

        sectionLabel: {
            marginBottom:
                4,

            fontSize:
                11,

            fontWeight:
                "700",

            letterSpacing:
                0.8,

            color:
                "#9b94a8",
        },

        accountName: {
            fontSize:
                17,

            fontWeight:
                "600",

            color:
                "#ffffff",
        },

        accountEmail: {
            fontSize:
                13,

            color:
                "#9b94a8",
        },
    });