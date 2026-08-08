import { StyleSheet } from "react-native";

import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../theme";

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.huge,
  },

  hero: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xxxl,
  },

  logo: {
    width: 600,
    height: 200,
    marginBottom: spacing.xl,
  },

  intro: {
    alignItems: "center",
    maxWidth: 720,
    alignSelf: "center",
    marginBottom: spacing.xxl,
  },

  eyebrow: {
    ...typography.label,
    color: colors.primaryLight,
    textAlign: "center",
    marginBottom: spacing.md,
  },

  heading: {
    ...typography.hero,
    color: colors.text,
    textAlign: "center",
  },

  introText: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.md,
    maxWidth: 620,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },

  errorCard: {
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: "#27171A",
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
  },

  errorTitle: {
    color: colors.danger,
    fontWeight: "700",
  },

  errorText: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  exploreWrapper: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xxxl,
  },

  exploreArrow: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
  },

  sectionHeading: {
    marginBottom: spacing.lg,
  },

  sectionEyebrow: {
    ...typography.label,
    color: colors.primaryLight,
  },

  sectionTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xs,
  },

  navigationGrid: {
    gap: spacing.md,
    marginBottom: spacing.xxxl,
  },

  intelligenceCard: {
    borderWidth: 1,
    borderColor: "rgba(142,91,255,0.32)",
    backgroundColor: colors.backgroundDeep,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    marginBottom: spacing.xxxl,
    ...shadows.card,
  },

  intelligenceBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryMuted,
    marginBottom: spacing.lg,
  },

  intelligenceBadgeText: {
    ...typography.label,
    color: colors.primaryLight,
    fontSize: 9,
  },

  intelligenceTitle: {
    ...typography.h2,
    color: colors.text,
    fontSize: 25,
  },

  intelligenceText: {
    ...typography.body,
    color: colors.textSecondary,
    maxWidth: 700,
    marginTop: spacing.sm,
  },

  intelligenceFeatures: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },

  feature: {
    ...typography.small,
    color: colors.textSecondary,
    fontSize: 14,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.lg,
  },

  footerLine: {
    flex: 1,
    maxWidth: 90,
    height: 1,
    backgroundColor: "rgba(142,91,255,0.35)",
  },

  footerText: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  footerStar: {
    color: colors.primary,
    fontSize: 12,
  },
});