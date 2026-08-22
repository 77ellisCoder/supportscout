import { StyleSheet } from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../../theme";
import { layoutStyles } from "./layout.styles";

/** Shared styles for create/edit entity forms. */
export const formStyles = StyleSheet.create({
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
  },

  loadingText: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },

  eyebrow: {
    ...typography.label,
    color: colors.primaryLight,
    marginBottom: spacing.sm,
  },

  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },

  errorCard: {
    backgroundColor: "#27171A",
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  errorText: {
    color: colors.danger,
  },

  field: {
    marginBottom: spacing.lg,
  },

  fieldLabel: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: "700",
    marginBottom: spacing.sm,
  },

  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  textArea: {
    minHeight: 110,
    textAlignVertical: "top",
  },

  section: {
    marginBottom: spacing.xl,
  },

  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  statusChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  statusChipSelected: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },

  statusChipText: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: "capitalize",
  },

  statusChipTextSelected: {
    color: colors.primaryLight,
    fontWeight: "700",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  switchContent: {
    flex: 1,
  },

  helperText: {
    ...typography.small,
    color: colors.textMuted,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },

  saveButtonPressed: {
    opacity: 0.9,
  },

  saveButtonDisabled: {
    opacity: 0.55,
  },

  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  header: {
    ...layoutStyles.contentWidth,
    paddingHorizontal: spacing.xl,
  },

  list: {
    ...layoutStyles.contentWidth,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.huge,
  },
});
