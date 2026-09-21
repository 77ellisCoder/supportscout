import {
    StyleSheet,
} from "react-native";

export const styles =
    StyleSheet.create({
        card: {
            backgroundColor:
                "#16131f",

            borderRadius: 16,

            borderWidth: 1,

            borderColor:
                "#302840",

            padding: 16,

            gap: 14,
        },

        header: {
            gap: 4,
        },

        title: {
            fontSize: 20,

            fontWeight: "700",

            color: "#ffffff",
        },

        subtitle: {
            fontSize: 13,

            lineHeight: 18,

            color: "#aaa4b7",
        },

        settingRow: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "space-between",

            gap: 12,
        },

        settingText: {
            flex: 1,

            gap: 2,
        },

        settingLabel: {
            fontSize: 14,

            fontWeight: "600",

            color: "#ffffff",
        },

        settingDescription: {
            fontSize: 12,

            lineHeight: 17,

            color: "#948da3",
        },

        numberField: {
            flexDirection:
                "row",

            alignItems:
                "center",

            gap: 5,
        },

        numberInput: {
            width: 58,

            borderWidth: 1,

            borderColor:
                "#403650",

            borderRadius: 8,

            paddingHorizontal: 8,

            paddingVertical: 6,

            color: "#ffffff",

            backgroundColor:
                "#0f0c16",

            textAlign:
                "center",

            fontSize: 13,
        },

        unitText: {
            color: "#948da3",

            fontSize: 12,
        },

        timezoneBox: {
            gap: 4,
        },

        timezoneValue: {
            color: "#a991ff",

            fontSize: 13,
        },

        divider: {
            height: 1,

            backgroundColor:
                "#302840",
        },

        sectionTitle: {
            fontSize: 16,

            fontWeight: "700",

            color: "#ffffff",
        },

        /*
         * Weekly availability
         */

        days: {
            width: "100%",

            gap: 6,
        },

        dayRow: {
            width: "100%",

            flexDirection:
                "row",

            alignItems:
                "center",

            paddingHorizontal: 8,

            paddingVertical: 6,

            borderRadius: 10,

            borderWidth: 1,

            borderColor:
                "#2d2638",

            backgroundColor:
                "#110e18",

            gap: 8,

            position:
                "relative",

            zIndex: 0,

            overflow:
                "visible",
        },

        dayToggle: {
            width: 96,

            borderRadius: 8,

            paddingVertical: 7,

            paddingHorizontal: 8,

            borderWidth: 1,

            alignItems:
                "center",

            justifyContent:
                "center",
        },

        dayToggleEnabled: {
            backgroundColor:
                "#6f46d9",

            borderColor:
                "#8057eb",
        },

        dayToggleDisabled: {
            backgroundColor:
                "#15121d",

            borderColor:
                "#393143",
        },

        dayToggleText: {
            color: "#8f879c",

            fontWeight: "600",

            fontSize: 12,
        },

        dayToggleTextEnabled: {
            color: "#ffffff",
        },

        /*
         * Time controls
         */

        timeFields: {
            flexDirection:
                "row",

            alignItems:
                "center",

            gap: 6,
        },

        timeInput: {
            width: 76,

            paddingHorizontal: 8,

            paddingVertical: 7,

            borderRadius: 8,

            borderWidth: 1,

            borderColor:
                "#403650",

            backgroundColor:
                "#0f0c16",

            color: "#ffffff",

            textAlign:
                "center",

            fontSize: 12,
        },

        toText: {
            color: "#857d91",

            fontSize: 11,
        },

        timePickerButton: {
            minWidth: 76,

            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "center",

            paddingHorizontal: 8,

            paddingVertical: 7,

            borderRadius: 8,

            borderWidth: 1,

            borderColor:
                "#403650",

            backgroundColor:
                "#0b0910",
        },

        timePickerButtonPressed: {
            opacity: 0.8,
        },

        timePickerButtonText: {
            color: "#ffffff",

            fontSize: 12,

            fontWeight: "500",
        },

        timePickerChevron: {
            color: "#81788e",

            fontSize: 10,
        },

        /*
         * Web time-picker menu
         */

        timePickerOverlay: {
            flex: 1,

            position:
                "relative",
        },

        timePickerModalMenu: {
            position:
                "absolute",

            width: 130,

            maxHeight: 280,

            borderRadius: 9,

            borderWidth: 1,

            borderColor:
                "#403650",

            backgroundColor:
                "#17121f",

            shadowColor:
                "#000000",

            shadowOpacity: 0.45,

            shadowRadius: 14,

            shadowOffset: {
                width: 0,

                height: 6,
            },

            elevation: 30,

            overflow:
                "hidden",
        },

        timePickerScroll: {
            maxHeight: 280,
        },

        timePickerOption: {
            paddingHorizontal: 12,

            paddingVertical: 8,
        },

        timePickerOptionSelected: {
            backgroundColor:
                "#7047dc",
        },

        timePickerOptionPressed: {
            backgroundColor:
                "#292035",
        },

        timePickerOptionText: {
            color: "#c0b9c9",

            fontSize: 12,
        },

        timePickerOptionTextSelected: {
            color: "#ffffff",

            fontWeight: "600",
        },

        /*
         * Save / status
         */

        saveButton: {
            marginTop: 2,

            borderRadius: 10,

            paddingVertical: 10,

            paddingHorizontal: 16,

            alignItems:
                "center",

            backgroundColor:
                "#7047dc",
        },

        saveButtonDisabled: {
            opacity: 0.6,
        },

        saveButtonText: {
            color: "#ffffff",

            fontWeight: "700",

            fontSize: 14,
        },

        saveError: {
            color: "#ff7d8a",

            fontSize: 12,
        },

        saveSuccess: {
            color: "#86d39d",

            fontSize: 12,
        },

        /*
         * Loading / error states
         */

        loading: {
            padding: 24,

            alignItems:
                "center",

            gap: 10,
        },

        loadingText: {
            color: "#aaa4b7",

            fontSize: 13,
        },

        errorBox: {
            padding: 14,

            borderRadius: 10,

            borderWidth: 1,

            borderColor:
                "#65333b",

            backgroundColor:
                "#28171c",
        },

        errorText: {
            color: "#ff929c",

            fontSize: 13,
        },
    });