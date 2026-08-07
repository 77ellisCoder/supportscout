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
};
