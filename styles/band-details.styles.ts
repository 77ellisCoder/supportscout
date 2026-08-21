import { StyleSheet } from "react-native";

import {
    colors,
    radius,
    spacing,
    typography,
} from "../theme";

import { detailStyles } from "./shared/details.styles";

export const styles = StyleSheet.create({
    ...detailStyles,

    // --------------------------------------------------
    // Recent gigs
    // --------------------------------------------------

    gigList: {
        gap: spacing.sm,
    },

    gigRow: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: colors.surface,

        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.lg,

        padding: spacing.md,
    },

    gigRowPressed: {
        borderColor: colors.primary,
        backgroundColor: colors.surfaceHover,
    },

    gigDate: {
        width: 48,
        height: 48,

        borderRadius: radius.md,
        backgroundColor: colors.primaryMuted,

        alignItems: "center",
        justifyContent: "center",

        marginRight: spacing.md,
    },

    gigDateDay: {
        color: colors.primaryLight,
        fontSize: 18,
        fontWeight: "700",
    },

    gigDateMonth: {
        ...typography.small,

        color: colors.textMuted,
        fontSize: 9,
        fontWeight: "700",
    },

    gigContent: {
        flex: 1,
    },

    gigTitle: {
        ...typography.h3,
        color: colors.text,
    },

    gigVenue: {
        ...typography.small,
        color: colors.primaryLight,
        marginTop: spacing.xs,
    },

    gigMeta: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },

    chevron: {
        color: colors.textMuted,
        fontSize: 26,
        marginLeft: spacing.md,
    },
});