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

  formContainer: {
    ...layoutStyles.formContainer,
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

  label: {
    ...typography.label
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
    alignSelf: "flex-start",

    backgroundColor: colors.primary,

    borderRadius: radius.pill,

    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,

    alignItems: "center",
    justifyContent: "center",
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

  toggleRow: {
    flexDirection: "row",
    gap: spacing.xl,

    padding: spacing.lg,

    backgroundColor: colors.surface,

    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },

  toggleItem: {
    flex: 1,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: spacing.lg,
  },

  toggleContent: {
    flex: 1,
  },

  toggleLabel: {
    ...typography.small,
    color: colors.text,
    fontWeight: "700",
  },

  formRow: {
    flexDirection: "row",
    gap: spacing.lg,
    alignItems: "flex-start",
  },

  formColumn: {
    flex: 1,
  },

  formColumnSmall: {
    flex: 0.5,
  },
});
