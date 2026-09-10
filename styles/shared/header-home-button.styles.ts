import { StyleSheet } from "react-native";

import { spacing } from "../../theme";

export const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  pressed: {
    opacity: 0.7,
  },

  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },
});