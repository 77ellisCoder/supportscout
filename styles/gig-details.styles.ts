import { StyleSheet } from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../theme";
import { detailStyles } from "./shared/details.styles";

const gigDetailStyles = StyleSheet.create({
  currentRole: {
    ...typography.label,
    color: colors.primaryLight,
    fontSize: 9,
    marginTop: 2,
  },

  date: {
    ...typography.small,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },

  metaRow: {
    marginTop: spacing.lg,
  },

  meta: {
    ...typography.small,
    color: colors.primaryLight,
    fontWeight: "700",
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: spacing.lg,
    paddingVertical: spacing.xs,
  },

  backButtonPressed: {
    opacity: 0.6,
  },

  backButtonText: {
    ...typography.small,
    color: colors.primaryLight,
    fontWeight: "700",
  },

  linkTitle: {
    ...typography.h3,
    color: colors.primaryLight,
  },

  lineup: {
    gap: spacing.sm,
  },

  lineupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  lineupRowPressed: {
    opacity: 0.7,
  },

  billingOrder: {
    width: 30,
    height: 30,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  billingOrderText: {
    ...typography.small,
    color: colors.primaryLight,
    fontWeight: "700",
  },

  lineupContent: {
    flex: 1,
  },

  bandRole: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },

  chevron: {
    color: colors.textMuted,
    fontSize: 24,
    marginLeft: spacing.md,
  },
});

export const styles = {
  ...detailStyles,
  ...gigDetailStyles,
};
