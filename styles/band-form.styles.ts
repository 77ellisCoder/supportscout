import { StyleSheet } from "react-native";

import { spacing } from "../theme";
import { formStyles } from "./shared/forms.styles";

const bandFormOverrides = StyleSheet.create({
    container: {
        paddingBottom: spacing.huge,
    },

    formRow: {
        flexWrap: "wrap",
    },

    formColumn: {
        minWidth: 220,
    },

    formColumnSmall: {
        minWidth: 120,
        flex: 0.5,
    },

    section: {
        marginBottom: spacing.lg,
    },

    toggleRow: {
        flexWrap: "wrap",
    },

    toggleItem: {
        minWidth: 220,
    },
});

export const styles = {
    ...formStyles,

    container: [
        formStyles.container,
        bandFormOverrides.container,
    ],

    formRow: [
        formStyles.formRow,
        bandFormOverrides.formRow,
    ],

    formColumn: [
        formStyles.formColumn,
        bandFormOverrides.formColumn,
    ],

    formColumnSmall: [
        formStyles.formColumnSmall,
        bandFormOverrides.formColumnSmall,
    ],

    section: [
        formStyles.section,
        bandFormOverrides.section,
    ],

    toggleRow: [
        formStyles.toggleRow,
        bandFormOverrides.toggleRow,
    ],

    toggleItem: [
        formStyles.toggleItem,
        bandFormOverrides.toggleItem,
    ],
};