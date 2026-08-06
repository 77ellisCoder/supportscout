export type Band = {
  bandId: number;
  bandName: string;
  hometown?: string;
  memberCount?: number;
  status: "active" | "inactive" | "hiatus" | "unknown";
  isOurBand: boolean;
  isVerified: boolean;
};
