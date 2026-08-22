import { StyleSheet } from "react-native";

import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../theme";

import { detailStyles } from "./shared/details.styles";

export const gigDetailStyles = StyleSheet.create({
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

  gigCard: {
    width: "100%",

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,

    padding: spacing.lg,

    flexDirection: "row",
    alignItems: "center",

    ...shadows.card,
  },

  gigCardPressed: {
    backgroundColor: colors.surfaceHover,
    borderColor: colors.primary,

    transform: [
      {
        scale: 0.995,
      },
    ],
  },
});

export const styles = {
  ...detailStyles,
  ...gigDetailStyles,
};
