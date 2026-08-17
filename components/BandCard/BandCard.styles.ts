import { StyleSheet } from "react-native";

import {
  colors,
  radius,
  spacing,
} from "../../theme";

export const styles = StyleSheet.create({
  scoreBadge: {
    minWidth: 38,
    height: 28,

    paddingHorizontal: spacing.sm,

    borderRadius: radius.pill,
    backgroundColor: colors.primaryMuted,

    alignItems: "center",
    justifyContent: "center",
  },

  score: {
    color: colors.primaryLight,
    fontSize: 13,
    fontWeight: "700",
  },
});