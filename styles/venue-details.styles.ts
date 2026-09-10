import { StyleSheet } from "react-native";

import {
  colors,
  spacing,
  typography,
} from "../theme";
import { detailStyles } from "./shared/details.styles";

const venueDetailStyles = StyleSheet.create({
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  verifiedInline: {
    ...typography.small,
    color: colors.textSecondary,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },

  detailLabel: {
    ...typography.small,
    color: colors.textMuted,
  },

  detailValue: {
    ...typography.small,
    color: colors.text,
    textAlign: "right",
    flexShrink: 1,
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    paddingVertical: spacing.sm,
  },

  linkLabel: {
    ...typography.small,
    color: colors.textMuted,
  },

  linkText: {
    ...typography.small,
    color: colors.primaryLight,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",

    gap: spacing.lg,

    marginBottom: spacing.xxl,
  },

  inlineRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.lg,
  },

  inlineFieldWide: {
    flex: 2,
  },

  inlineField: {
    flex: 1,
  },
});

export const styles = {
  ...detailStyles,
  ...venueDetailStyles,
};
