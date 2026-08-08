import { getDatabase } from "../database/sqlite/Database";
import type { Band, BandStatus, CreateBandInput } from "../models/Band";

type BandRow = {
  band_id: number;
  band_name: string;
  slug: string | null;
  hometown: string | null;
  state_region: string | null;
  country_code: string | null;
  member_count: number | null;
  formation_year: number | null;
  status: BandStatus;
  short_description: string | null;
  internal_notes: string | null;
  is_our_band: number;
  is_verified: number;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

function mapBand(row: BandRow): Band {
  return {
    bandId: row.band_id,
    bandName: row.band_name,
    slug: row.slug,
    hometown: row.hometown,
    stateRegion: row.state_region,
    countryCode: row.country_code,
    memberCount: row.member_count,
    formationYear: row.formation_year,
    status: row.status,
    shortDescription: row.short_description,
    internalNotes: row.internal_notes,
    isOurBand: row.is_our_band === 1,
    isVerified: row.is_verified === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const BandRepository = {
  async getAll(search?: string): Promise<Band[]> {
    const db = await getDatabase();

    const rows = search?.trim()
      ? await db.getAllAsync<BandRow>(
        `
          SELECT *
          FROM bands
          WHERE archived_at IS NULL
            AND band_name LIKE ?
          ORDER BY band_name COLLATE NOCASE
        `,
        `%${search.trim()}%`
      )
      : await db.getAllAsync<BandRow>(
        `
          SELECT *
          FROM bands
          WHERE archived_at IS NULL
          ORDER BY band_name COLLATE NOCASE
        `
      );

    return rows.map(mapBand);
  },

  async getById(bandId: number): Promise<Band | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<BandRow>(
      "SELECT * FROM bands WHERE band_id = ?",
      bandId
    );

    return row ? mapBand(row) : null;
  },

  async create(input: CreateBandInput): Promise<Band> {
    const bandName = input.bandName.trim();
    if (!bandName) throw new Error("Band name is required.");

    const db = await getDatabase();
    const result = await db.runAsync(
      `INSERT INTO bands (
        band_name, slug, hometown, state_region, country_code,
        member_count, formation_year, status, short_description,
        internal_notes, is_our_band, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      bandName,
      input.slug ?? slugify(bandName),
      input.hometown ?? "Perth",
      input.stateRegion ?? "Western Australia",
      input.countryCode ?? "AU",
      input.memberCount ?? null,
      input.formationYear ?? null,
      input.status ?? "active",
      input.shortDescription ?? null,
      input.internalNotes ?? null,
      input.isOurBand ? 1 : 0,
      input.isVerified ? 1 : 0
    );

    const created = await this.getById(result.lastInsertRowId);
    if (!created) throw new Error("Unable to reload created band.");
    return created;
  },

  async archive(bandId: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE bands
       SET archived_at = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE band_id = ?`,
      bandId
    );
  },
};
