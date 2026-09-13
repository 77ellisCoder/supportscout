import {
    StyleSheet,
} from "react-native";

export const styles =
    StyleSheet.create({
        card: {
            backgroundColor:
                "#16131f",

            borderRadius: 18,

            borderWidth: 1,

            borderColor:
                "#302840",

            padding: 20,

            gap: 18,
        },

        header: {
            gap: 6,
        },

        title: {
            fontSize: 22,

            fontWeight: "700",

            color: "#ffffff",
        },

        subtitle: {
            fontSize: 14,

            lineHeight: 20,

            color: "#aaa4b7",
        },

        settingRow: {
            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "space-between",

            gap: 20,
        },

        settingText: {
            flex: 1,

            gap: 3,
        },

        settingLabel: {
            fontSize: 15,

            fontWeight: "600",

            color: "#ffffff",
        },

        settingDescription: {
            fontSize: 13,

            lineHeight: 18,

            color: "#948da3",
        },

        numberField: {
            flexDirection:
                "row",

            alignItems:
                "center",

            gap: 6,
        },

        numberInput: {
            width: 70,

            borderWidth: 1,

            borderColor:
                "#403650",

            borderRadius: 10,

            paddingHorizontal: 12,

            paddingVertical: 9,

            color: "#ffffff",

            backgroundColor:
                "#0f0c16",

            textAlign:
                "center",
        },

        unitText: {
            color: "#948da3",
        },

        timezoneBox: {
            gap: 5,
        },

        timezoneValue: {
            color: "#a991ff",

            fontSize: 14,
        },

        divider: {
            height: 1,

            backgroundColor:
                "#302840",
        },

        sectionTitle: {
            fontSize: 17,

            fontWeight: "700",

            color: "#ffffff",
        },

        days: {
            gap: 10,

            minWidth: 520,
        },

        dayRow: {
            minHeight: 58,

            flexDirection: "row",
            alignItems: "center",

            paddingHorizontal: 14,
            paddingVertical: 10,

            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#2d2638",

            backgroundColor: "#110e18",

            gap: 16,

            position: "relative",
            zIndex: 0,

            overflow: "visible",
        },

        dayToggle: {
            width: 120,

            borderRadius: 10,

            paddingVertical: 10,

            paddingHorizontal: 12,

            borderWidth: 1,
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
        },

        dayToggleTextEnabled: {
            color: "#ffffff",
        },

        timeFields: {
            flexDirection:
                "row",

            alignItems:
                "center",

            gap: 10,
        },

        timeInput: {
            width: 85,

            paddingHorizontal: 10,

            paddingVertical: 9,

            borderRadius: 9,

            borderWidth: 1,

            borderColor:
                "#403650",

            backgroundColor:
                "#0f0c16",

            color: "#ffffff",

            textAlign:
                "center",
        },

        toText: {
            color: "#857d91",
        },

        saveButton: {
            marginTop: 4,

            borderRadius: 12,

            paddingVertical: 13,

            paddingHorizontal: 18,

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

            fontSize: 15,
        },

        saveError: {
            color: "#ff7d8a",

            fontSize: 13,
        },

        saveSuccess: {
            color: "#86d39d",

            fontSize: 13,
        },

        loading: {
            padding: 30,

            alignItems:
                "center",

            gap: 12,
        },

        loadingText: {
            color: "#aaa4b7",
        },

        errorBox: {
            padding: 18,

            borderRadius: 12,

            borderWidth: 1,

            borderColor:
                "#65333b",

            backgroundColor:
                "#28171c",
        },

        errorText: {
            color: "#ff929c",
        },

        timePickerButton: {
            minWidth: 105,

            flexDirection:
                "row",

            alignItems:
                "center",

            justifyContent:
                "space-between",

            gap: 8,

            paddingHorizontal: 12,

            paddingVertical: 9,

            borderRadius: 9,

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

            fontSize: 14,

            fontWeight: "500",
        },

        timePickerChevron: {
            color: "#81788e",

            fontSize: 12,
        },

        timePickerOverlay: {
            flex: 1,

            position: "relative",
        },

        timePickerModalMenu: {
            position: "absolute",

            width: 140,
            maxHeight: 300,

            borderRadius: 10,

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

            overflow: "hidden",
        },

        timePickerScroll: {
            maxHeight: 300,
        },

        timePickerOption: {
            paddingHorizontal: 14,
            paddingVertical: 10,
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
            fontSize: 13,
        },

        timePickerOptionTextSelected: {
            color: "#ffffff",
            fontWeight: "600",
        },
    });