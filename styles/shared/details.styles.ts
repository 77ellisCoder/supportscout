import { StyleSheet } from "react-native";

import {
  colors,
  radius,
  shadows,
  spacing,
  typography,
} from "../../theme";

import { layoutStyles } from "./layout.styles";

/** Shared shell and content styles for entity detail screens. */
export const detailStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    ...layoutStyles.contentContainer,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  loadingText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  errorTitle: {
    ...typography.h3,
    color: colors.text,
  },

  errorText: {
    ...typography.body,
    color: colors.danger,
    marginTop: spacing.sm,
  },

  hero: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.card,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.lg,
  },

  titleContent: {
    flex: 1,
  },

  eyebrow: {
    ...typography.label,
    color: colors.primaryLight,
    marginBottom: spacing.sm,
  },

  title: {
    ...typography.h1,
    color: colors.text,
  },

  description: {
    ...typography.body,
    color: colors.primaryLight,
    marginTop: spacing.sm,
  },

  verifiedBadge: {
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  verifiedText: {
    ...typography.label,
    color: colors.primaryLight,
    fontSize: 9,
  },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.lg,
  },

  meta: {
    ...typography.small,
    color: colors.textMuted,
  },

  metaDot: {
    ...typography.small,
    color: colors.textMuted,
  },

  section: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.lg,
  },

  sectionLabel: {
    ...typography.label,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  statusText: {
    ...typography.small,
    color: colors.primaryLight,
    fontWeight: "700",
  },

  bodyText: {
    ...typography.body,
    color: colors.textSecondary,
  },

  actions: {
    marginTop: spacing.sm,
  },

  editButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },

  editButtonPressed: {
    opacity: 0.9,
  },

  editButtonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
