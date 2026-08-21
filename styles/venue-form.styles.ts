import { spacing } from "../theme";
import { formStyles } from "./shared/forms.styles";

export const styles = {
  ...formStyles,

  // Venue forms use a little more separation before the next section.
  switchRow: [
    formStyles.switchRow,
    { marginBottom: spacing.xl },
  ],

  // Unlike BandForm, the venue save action does not need extra top margin.
  saveButton: [
    formStyles.saveButton,
    { marginTop: 0 },
  ],
};
