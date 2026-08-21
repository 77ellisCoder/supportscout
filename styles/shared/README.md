# Shared styles

These modules contain repeated visual patterns only:

- `forms.styles.ts` — create/edit form shells, inputs, status chips, switches, save actions.
- `details.styles.ts` — detail-screen shells, hero cards, sections, status badges, edit actions.
- `finders.styles.ts` — Band/Venue finder layout, filters, result header and add action.
- `EntityCard.styles.ts` — shared entity-list card.

Feature style files spread/override these shared styles only where the feature differs. Existing import paths are retained where practical so component changes are minimal.
