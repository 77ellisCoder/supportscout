import { StyleSheet } from "react-native";

import {
  colors,
  radius,
  spacing,
  typography,
} from "../theme";
import { formStyles } from "./shared/forms.styles";

const gigFormStyles = StyleSheet.create({
  dateButton: {
    minHeight: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateButtonPressed: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceHover,
  },

  dateButtonText: {
    ...typography.body,
    color: colors.text,
  },

  dateButtonPlaceholder: {
    color: colors.textMuted,
  },

  calendarIcon: {
    fontSize: 18,
    marginLeft: spacing.md,
  },

  sectionLabel: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: "700",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },

  optionChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  optionChipSelected: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },

  optionChipText: {
    ...typography.small,
    color: colors.textMuted,
    textTransform: "capitalize",
  },

  optionChipTextSelected: {
    color: colors.primaryLight,
    fontWeight: "700",
  },
});

export const styles = {
  ...formStyles,
  ...gigFormStyles,
};
