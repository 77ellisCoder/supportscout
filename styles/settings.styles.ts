import {
    StyleSheet,
} from "react-native";

export const styles =
    StyleSheet.create({
        container: {
            flexGrow: 1,

            padding: 18,

            gap: 16,

            backgroundColor:
                "#0d0d14",
        },

        header: {
            gap: 4,
        },

        title: {
            fontSize: 26,

            fontWeight:
                "700",

            color:
                "#ffffff",
        },

        subtitle: {
            fontSize: 13,

            lineHeight: 18,

            color:
                "#9b94a8",
        },

        /*
         * Account
         */

        accountCard: {
            width: "100%",

            padding: 16,

            borderWidth: 1,

            borderColor:
                "#2d2738",

            borderRadius: 14,

            backgroundColor:
                "#15121c",

            gap: 12,
        },

        accountDetails: {
            width: "100%",

            gap: 3,
        },

        sectionLabel: {
            marginBottom: 3,

            fontSize: 11,

            fontWeight:
                "700",

            letterSpacing: 0.8,

            color:
                "#9b94a8",
        },

        accountName: {
            fontSize: 16,

            fontWeight:
                "600",

            color:
                "#ffffff",
        },

        accountEmail: {
            width: "100%",

            fontSize: 13,

            lineHeight: 18,

            color:
                "#9b94a8",
        },

        /*
         * General settings cards
         */

        settingsCard: {
            width: "100%",

            padding: 16,

            borderWidth: 1,

            borderColor:
                "#2d2738",

            borderRadius: 14,

            backgroundColor:
                "#15121c",

            gap: 12,
        },

        settingsDetails: {
            width: "100%",

            gap: 4,
        },

        settingsTitle: {
            fontSize: 16,

            fontWeight:
                "600",

            color:
                "#ffffff",
        },

        settingsDescription: {
            width: "100%",

            fontSize: 13,

            lineHeight: 18,

            color:
                "#9b94a8",
        },

        /*
         * Calendar connections
         */

        calendarCard: {
            width: "100%",

            padding: 16,

            borderWidth: 1,

            borderColor:
                "#2d2738",

            borderRadius: 14,

            backgroundColor:
                "#15121c",

            gap: 14,
        },

        calendarHeader: {
            width: "100%",

            gap: 4,
        },

        calendarConnection: {
            width: "100%",

            gap: 10,
        },

        calendarDetails: {
            width: "100%",

            gap: 4,
        },

        calendarActions: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "flex-start",

            flexWrap:
                "wrap",

            gap: 8,
        },

        calendarConnected: {
            fontSize: 12,

            fontWeight:
                "600",

            color:
                "#b89cff",
        },

        calendarDivider: {
            height: 1,

            backgroundColor:
                "#2d2738",
        },

        calendarError: {
            fontSize: 12,

            lineHeight: 17,

            color:
                "#ff8f8f",
        },

        calendarProvider: {
            width: "100%",

            gap: 12,
        },

        /*
         * iCloud connection form
         */

        iCloudForm: {
            width: "100%",

            maxWidth: 640,

            paddingTop: 2,

            gap: 12,
        },

        calendarField: {
            width: "100%",

            gap: 5,
        },

        calendarFieldLabel: {
            fontSize: 12,

            fontWeight:
                "600",

            color:
                "#ffffff",
        },

        calendarInput: {
            width: "100%",

            minHeight: 40,

            paddingHorizontal: 10,

            paddingVertical: 8,

            borderWidth: 1,

            borderColor:
                "#3a3347",

            borderRadius: 9,

            backgroundColor:
                "#0d0d14",

            fontSize: 13,

            color:
                "#ffffff",
        },

        calendarFieldHelp: {
            width: "100%",

            fontSize: 12,

            lineHeight: 17,

            color:
                "#9b94a8",
        },

        calendarFormActions: {
            flexDirection:
                "row",

            justifyContent:
                "flex-start",

            alignItems:
                "center",

            flexWrap:
                "wrap",

            gap: 8,
        },

        compactButton: {
            minHeight: 34,

            paddingHorizontal: 12,

            paddingVertical: 6,

            borderRadius: 8,
        },

        compactButtonText: {
            fontSize: 12,

            lineHeight: 16,
        },
    });