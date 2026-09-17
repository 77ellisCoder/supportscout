import {
    StyleSheet,
} from "react-native";

import {
    layout,
} from "./shared/layout.styles";

export const styles =
    StyleSheet.create({
        card: {
            width:
                "100%",

            maxWidth:
                layout.contentMaxWidth,

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

        content: {
            flex:
                1,

            gap:
                6,
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

        bandList: {
            gap:
                6,
        },

        bandRow: {
            flexDirection:
                "row",

            alignItems:
                "center",

            gap:
                10,
        },

        bandName: {
            fontSize:
                17,

            fontWeight:
                "600",

            color:
                "#ffffff",
        },

        relationship: {
            paddingHorizontal:
                8,

            paddingVertical:
                3,

            borderRadius:
                10,

            backgroundColor:
                "#2d2340",

            fontSize:
                11,

            color:
                "#b78cff",

            textTransform:
                "capitalize",
        },

        empty: {
            fontSize:
                13,

            color:
                "#9b94a8",
        },

        error: {
            fontSize:
                13,

            color:
                "#ef5b68",
        },
    });