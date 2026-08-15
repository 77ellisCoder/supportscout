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

    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: spacing.xl,
  },

  appHeader: {
    width: "100%",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 18,
  },

  menu: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",

    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: spacing.xl,

    backgroundColor: colors.backgroundDeep,

    borderWidth: 1,
    borderColor: colors.primaryMuted,
    borderRadius: radius.xxl,

    ...shadows.card,
  },

  menuButton: {
    width: 48,
    height: 48,

    alignItems: "center",
    justifyContent: "center",

    borderRadius: radius.pill,
  },

  menuButtonPressed: {
    backgroundColor: colors.primaryMuted,
    opacity: 0.9,
  },

  menuIcon: {
    width: 42,
    height: 42,
  },

  brandBlock: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: spacing.sm,
  },

  brandName: {
    color: colors.text,

    fontSize: 28,
    lineHeight: 32,
    fontWeight: "700",

    letterSpacing: -0.8,

    textAlign: "center",
  },

  brandAccent: {
    color: colors.primaryLight,
  },

  brandTagline: {
    color: colors.textMuted,

    fontSize: 7,
    lineHeight: 10,
    fontWeight: "700",

    letterSpacing: 0.8,

    textAlign: "center",

    marginTop: 2,
  },

  headerSpacer: {
    width: 48,
    height: 48,
  },

  intro: {
    alignItems: "center",
    alignSelf: "center",

    maxWidth: 720,

    marginBottom: 18,
  },

  eyebrow: {
    ...typography.label,

    color: colors.primaryLight,
    textAlign: "center",

    marginBottom: spacing.sm,
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

    maxWidth: 620,

    marginTop: spacing.sm,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: 10,

    marginBottom: 16,
  },

  errorCard: {
    backgroundColor: "#27171A",

    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.lg,

    padding: spacing.lg,

    marginBottom: spacing.lg,
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

    marginTop: 20,
    marginBottom: 24,
  },

  exploreArrow: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
  },

  sectionHeading: {
    marginBottom: spacing.md,
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
    gap: 10,
    marginBottom: 28,
  },

  intelligenceCard: {
    backgroundColor: colors.backgroundDeep,

    borderWidth: 1,
    borderColor: "rgba(142,91,255,0.32)",
    borderRadius: radius.xxl,

    padding: spacing.lg,

    marginBottom: spacing.xxl,

    ...shadows.card,
  },

  intelligenceBadge: {
    alignSelf: "flex-start",

    backgroundColor: colors.primaryMuted,

    borderRadius: radius.pill,

    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,

    marginBottom: spacing.md,
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

    paddingVertical: spacing.md,
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

  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",

    gap: spacing.sm,

    marginTop: spacing.lg,
  },
});