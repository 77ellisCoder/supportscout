import supportBandImport from "../../../assets/imports/support-bands.json";

import { BandRepository } from "../../../repositories/BandRepository";

type ImportedBand = {
  bandName: string;
  genreStyle: string | null;
  similarArtists: string | null;
  memberCount: number | null;
  recentUpcomingGigs: string | null;
  estimatedDrawMin: number | null;
  estimatedDrawMax: number | null;
  redTemplesFit: number | null;
  bookingPriority: string | null;
  notes: string | null;
};

type ImportResult = {
  inserted: number;
  existing: number;
  skipped: number;
};

export async function importSupportBands(): Promise<ImportResult> {

  const result: ImportResult = {
    inserted: 0,
    existing: 0,
    skipped: 0,
  };

  const existingBands = await BandRepository.getAll();

  const existingByName = new Map(
    existingBands.map((band) => [
      band.bandName.trim().toLowerCase(),
      band,
    ])
  );

  for (const source of supportBandImport.bands as ImportedBand[]) {
    const bandName = source.bandName?.trim();

    if (!bandName) {
      result.skipped += 1;
      continue;
    }

    const lookupName = bandName.toLowerCase();

    if (existingByName.has(lookupName)) {
      result.existing += 1;
      continue;
    }

    const band = await BandRepository.create({
      bandName,
      memberCount: source.memberCount,
      hometown: "Perth",
      stateRegion: "Western Australia",
      countryCode: "AU",
      status: "active",
      shortDescription: source.genreStyle,
      internalNotes: source.notes,
      isVerified: false,
    });

    existingByName.set(lookupName, band);
    result.inserted += 1;
  }

  return result;
}