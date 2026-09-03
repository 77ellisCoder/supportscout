/**
 * This type represents a band, including its ID, name, slug, location details, member count, formation year, status, descriptions, verification status, and timestamps for creation, last update, and archival.
 */

export type BandStatus = "active" | "inactive" | "hiatus" | "unknown";

export type Band = {
  bandId: number;
  bandName: string;
  slug: string | null;
  hometown: string | null;
  stateRegion: string | null;
  countryCode: string | null;
  memberCount: number | null;
  formationYear: number | null;
  status: BandStatus;
  shortDescription: string | null;
  internalNotes: string | null;
  isOurBand: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  bookingContactName: string | null;
  contactEmail: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  websiteUrl: string | null;
  genreIds?: number[];
};

export type CreateBandInput = {
  bandName: string;
  slug?: string | null;
  hometown?: string | null;
  stateRegion?: string | null;
  countryCode?: string | null;
  memberCount?: number | null;
  formationYear?: number | null;
  status?: BandStatus;
  shortDescription?: string | null;
  internalNotes?: string | null;
  isOurBand?: boolean;
  isVerified?: boolean;
  bookingContactName?: string | null;
  contactEmail?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  websiteUrl?: string | null;
  genreIds?: number[];
};
