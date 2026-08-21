import { getDatabase } from "../database/sqlite/Database";

import type {
    Gig,
    GigListItem,
    GigStatus,
} from "../models/Gig";

type GigRow = {
    gig_id: number;
    venue_id: number | null;
    gig_date: string;
    event_name: string | null;
    notes: string | null;
    status: GigStatus;
    created_at: string;
    updated_at: string;
};

type GigListRow = GigRow & {
    venue_name: string | null;
    suburb: string | null;
    band_count: number;
};

export const GigRepository = {
    async getAll(): Promise<GigListItem[]> {
        const db = await getDatabase();

        const rows =
            await db.getAllAsync<GigListRow>(`
        SELECT
          g.gig_id,
          g.venue_id,
          g.gig_date,
          g.event_name,
          g.notes,
          g.status,
          g.created_at,
          g.updated_at,

          v.venue_name,
          v.suburb,

          COUNT(gb.band_id) AS band_count

        FROM gigs g

        LEFT JOIN venues v
          ON v.venue_id = g.venue_id

        LEFT JOIN gig_bands gb
          ON gb.gig_id = g.gig_id

        GROUP BY
          g.gig_id,
          g.venue_id,
          g.gig_date,
          g.event_name,
          g.notes,
          g.status,
          g.created_at,
          g.updated_at,
          v.venue_name,
          v.suburb

        ORDER BY
          g.gig_date DESC,
          g.gig_id DESC
      `);

        return rows.map(mapGigListRow);
    },

    async getById(
        gigId: number
    ): Promise<Gig | null> {
        const db = await getDatabase();

        const row =
            await db.getFirstAsync<GigRow>(
                `
          SELECT
            gig_id,
            venue_id,
            gig_date,
            event_name,
            notes,
            status,
            created_at,
            updated_at
          FROM gigs
          WHERE gig_id = ?
        `,
                gigId
            );

        if (!row) {
            return null;
        }

        return mapGigRow(row);
    },
};

function mapGigRow(
    row: GigRow
): Gig {
    return {
        gigId: row.gig_id,
        venueId: row.venue_id,
        gigDate: row.gig_date,
        eventName: row.event_name,
        notes: row.notes,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

function mapGigListRow(
    row: GigListRow
): GigListItem {
    return {
        ...mapGigRow(row),

        venueName: row.venue_name,
        suburb: row.suburb,
        bandCount: row.band_count,
    };
}