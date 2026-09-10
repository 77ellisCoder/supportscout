import { Platform } from "react-native";

import { colors } from "./colors";

export const shadows = {
    card: Platform.select({
        web: {
            boxShadow:
                "0 6px 12px rgba(0, 0, 0, 0.25)",
        },
        default: {
            shadowColor: "#000000",
            shadowOpacity: 0.25,
            shadowRadius: 12,
            shadowOffset: {
                width: 0,
                height: 6,
            },
        },
    })!,

    primary: Platform.select({
        web: {
            boxShadow:
                "0 8px 20px rgba(142, 91, 255, 0.30)",
        },
        default: {
            shadowColor: colors.primary,
            shadowOpacity: 0.30,
            shadowRadius: 20,
            shadowOffset: {
                width: 0,
                height: 8,
            },
        },
    })!,
} as const;