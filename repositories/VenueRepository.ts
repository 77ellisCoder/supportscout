import { getDatabase } from "../database/sqlite/Database";
import type { Venue } from "../models/Venue";

type VenueRow = {
  venue_id: number;
  venue_name: string;
  slug: string | null;

  suburb: string | null;
  state_region: string;
  country_code: string;

  address: string | null;

  capacity: number | null;
  venue_type: string | null;

  website_url: string | null;
  booking_url: string | null;
  booking_email: string | null;

  short_description: string | null;
  internal_notes: string | null;

  status: Venue["status"];
  is_verified: number;
};

function mapVenue(row: VenueRow): Venue {
  return {
    venueId: row.venue_id,
    venueName: row.venue_name,
    slug: row.slug,

    suburb: row.suburb,
    stateRegion: row.state_region,
    countryCode: row.country_code,

    address: row.address,

    capacity: row.capacity,
    venueType: row.venue_type,

    websiteUrl: row.website_url,
    bookingUrl: row.booking_url,
    bookingEmail: row.booking_email,

    shortDescription: row.short_description,
    internalNotes: row.internal_notes,

    status: row.status,
    isVerified: row.is_verified === 1,
  };
}

export const VenueRepository = {
  async getAll(): Promise<Venue[]> {
    const db = await getDatabase();

    const rows = await db.getAllAsync<VenueRow>(`
      SELECT *
      FROM venues
      WHERE archived_at IS NULL
      ORDER BY venue_name COLLATE NOCASE
    `);

    return rows.map(mapVenue);
  },

  async getById(id: number): Promise<Venue | null> {
    const db = await getDatabase();

    const row = await db.getFirstAsync<VenueRow>(
      `
        SELECT *
        FROM venues
        WHERE venue_id = ?
          AND archived_at IS NULL
      `,
      id
    );

    return row ? mapVenue(row) : null;
  },
};