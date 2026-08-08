import { colors } from "./colors";

export const shadows = {
    card: {
        shadowColor: "#000000",
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: {
            width: 0,
            height: 6,
        },
    },

    primary: {
        shadowColor: colors.primary,
        shadowOpacity: 0.30,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 8,
        },
    },
} as const;