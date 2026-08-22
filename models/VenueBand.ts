/**
 * This type represents a band that is associated with a venue. It includes the band's ID, name, a short description, and the number of gigs they have performed at the venue.
 */

export type VenueBand = {
  bandId: number;
  bandName: string;
  shortDescription: string | null;
  gigCount: number;
};