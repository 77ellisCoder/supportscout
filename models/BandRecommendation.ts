/**
 * This type represents a band recommendation, including its ID, name, short description, shared gig and venue counts, and score.
 */

export type BandRecommendation = {
  bandId: number;
  bandName: string;
  shortDescription: string | null;

  sharedGigCount: number;
  sharedVenueCount: number;

  score: number;
};