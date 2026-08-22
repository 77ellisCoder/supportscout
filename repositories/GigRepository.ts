import { getDatabase } from "../database/sqlite/Database";
import { BandRecommendation } from "../models/BandRecommendation";

import type {
    Gig,
    GigDetail,
    GigListItem,
    GigStatus,
} from "../models/Gig";
import { VenueBand } from "../models/VenueBand";

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

        const bandRows =
            await db.getAllAsync<{
                band_id: number;
            }>(
                `
                SELECT band_id
                FROM gig_bands
                WHERE gig_id = ?
                ORDER BY billing_order
                `,
                gigId
            );

        return {
            ...mapGigRow(row),
            bandIds: bandRows.map(
                (band) => band.band_id
            ),
        };
    },

    async getByBandId(
        bandId: number,
        period: "upcoming" | "past"
    ): Promise<GigListItem[]> {
        const db = await getDatabase();

        const dateCondition =
            period === "upcoming"
                ? "g.gig_date >= date('now', 'localtime')"
                : "g.gig_date < date('now', 'localtime')";

        const orderDirection =
            period === "upcoming"
                ? "ASC"
                : "DESC";

        const rows =
            await db.getAllAsync<GigListRow>(
                `
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

                COUNT(gb_all.band_id) AS band_count

            FROM gigs g

            INNER JOIN gig_bands gb_filter
                ON gb_filter.gig_id = g.gig_id
                AND gb_filter.band_id = ?

            LEFT JOIN venues v
                ON v.venue_id = g.venue_id

            LEFT JOIN gig_bands gb_all
                ON gb_all.gig_id = g.gig_id

            WHERE ${dateCondition}

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
                g.gig_date ${orderDirection}
            `,
                bandId
            );

        return rows.map(mapGigListRow);
    },

    async getDetailById(
        gigId: number
    ): Promise<GigDetail | null> {
        const db = await getDatabase();

        const row =
            await db.getFirstAsync<
                GigRow & {
                    venue_name: string | null;
                    suburb: string | null;
                }
            >(
                `
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
          v.suburb

        FROM gigs g

        LEFT JOIN venues v
          ON v.venue_id = g.venue_id

        WHERE g.gig_id = ?
      `,
                gigId
            );

        if (!row) {
            return null;
        }

        const bandRows =
            await db.getAllAsync<{
                band_id: number;
                band_name: string;
                billing_order: number | null;
                role: string | null;
            }>(
                `
        SELECT
          b.band_id,
          b.band_name,
          gb.billing_order,
          gb.role

        FROM gig_bands gb

        INNER JOIN bands b
          ON b.band_id = gb.band_id

        WHERE gb.gig_id = ?

        ORDER BY
          gb.billing_order ASC,
          b.band_name ASC
      `,
                gigId
            );

        return {
            ...mapGigRow(row),

            bandIds: bandRows.map(
                (band) => band.band_id
            ),

            venueName: row.venue_name,
            suburb: row.suburb,

            bands: bandRows.map((band) => ({
                bandId: band.band_id,
                bandName: band.band_name,
                billingOrder: band.billing_order,
                role: band.role,
            })),
        };
    },

    async getByVenueId(
        venueId: number,
        period: "upcoming" | "past"
    ): Promise<GigListItem[]> {
        const db = await getDatabase();

        const dateCondition =
            period === "upcoming"
                ? "g.gig_date >= date('now', 'localtime')"
                : "g.gig_date < date('now', 'localtime')";

        const orderDirection =
            period === "upcoming"
                ? "ASC"
                : "DESC";

        const rows =
            await db.getAllAsync<GigListRow>(
                `
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

        WHERE
          g.venue_id = ?
          AND ${dateCondition}

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
          g.gig_date ${orderDirection}
      `,
                venueId
            );

        return rows.map(mapGigListRow);
    },

    async getBandsByVenueId(
        venueId: number
    ): Promise<VenueBand[]> {
        const db = await getDatabase();

        const rows = await db.getAllAsync<{
            band_id: number;
            band_name: string;
            short_description: string | null;
            gig_count: number;
        }>(
            `
      SELECT
        b.band_id,
        b.band_name,
        b.short_description,
        COUNT(DISTINCT g.gig_id) AS gig_count

      FROM bands b

      INNER JOIN gig_bands gb
        ON gb.band_id = b.band_id

      INNER JOIN gigs g
        ON g.gig_id = gb.gig_id

      WHERE
        g.venue_id = ?

      GROUP BY
        b.band_id,
        b.band_name,
        b.short_description

      ORDER BY
        gig_count DESC,
        b.band_name ASC
    `,
            venueId
        );

        return rows.map((row) => ({
            bandId: row.band_id,
            bandName: row.band_name,
            shortDescription:
                row.short_description,
            gigCount: row.gig_count,
        }));
    },

    async getBandRecommendations(
        bandId: number
    ): Promise<BandRecommendation[]> {
        const db = await getDatabase();

        const rows = await db.getAllAsync<{
            band_id: number;
            band_name: string;
            short_description: string | null;
            shared_gig_count: number;
            shared_venue_count: number;
        }>(
            `
      SELECT
        candidate.band_id,
        candidate.band_name,
        candidate.short_description,

        COUNT(
          DISTINCT CASE
            WHEN candidate_gb.gig_id = source_gb.gig_id
            THEN candidate_gb.gig_id
          END
        ) AS shared_gig_count,

        COUNT(
          DISTINCT CASE
            WHEN candidate_gig.venue_id = source_gig.venue_id
                 AND candidate_gig.venue_id IS NOT NULL
            THEN candidate_gig.venue_id
          END
        ) AS shared_venue_count

      FROM bands candidate

      INNER JOIN gig_bands candidate_gb
        ON candidate_gb.band_id = candidate.band_id

      INNER JOIN gigs candidate_gig
        ON candidate_gig.gig_id = candidate_gb.gig_id

      CROSS JOIN gig_bands source_gb

      INNER JOIN gigs source_gig
        ON source_gig.gig_id = source_gb.gig_id

      WHERE
        source_gb.band_id = ?
        AND candidate.band_id != ?

      GROUP BY
        candidate.band_id,
        candidate.band_name,
        candidate.short_description

      HAVING
        shared_gig_count > 0
        OR shared_venue_count > 0

      ORDER BY
        shared_gig_count DESC,
        shared_venue_count DESC,
        candidate.band_name ASC
    `,
            bandId,
            bandId
        );

        return rows.map((row) => {
            const sharedGigCount =
                Number(row.shared_gig_count);

            const sharedVenueCount =
                Number(row.shared_venue_count);

            return {
                bandId: row.band_id,
                bandName: row.band_name,
                shortDescription:
                    row.short_description,

                sharedGigCount,
                sharedVenueCount,

                score:
                    sharedGigCount * 3 +
                    sharedVenueCount * 2,
            };
        });
    },

    async create(
        input: {
            venueId: number | null;
            gigDate: string;
            eventName: string | null;
            notes: string | null;
            status: GigStatus;

            lineup: {
                bandId: number;
                role: string;
            }[];
        }
    ): Promise<Gig> {
        const db = await getDatabase();

        let gigId = 0;

        await db.withTransactionAsync(async () => {
            const result = await db.runAsync(
                `
        INSERT INTO gigs (
          venue_id,
          gig_date,
          event_name,
          notes,
          status
        )
        VALUES (?, ?, ?, ?, ?)
      `,
                input.venueId,
                input.gigDate,
                input.eventName,
                input.notes,
                input.status
            );

            gigId = Number(
                result.lastInsertRowId
            );

            for (
                let index = 0;
                index < input.lineup.length;
                index++
            ) {
                const item =
                    input.lineup[index];

                await db.runAsync(
                    `
                    INSERT INTO gig_bands (
                        gig_id,
                        band_id,
                        billing_order,
                        role
                    )
                    VALUES (?, ?, ?, ?)
                    `,
                    gigId,
                    item.bandId,
                    index + 1,
                    item.role
                );
            }
        });

        const created =
            await this.getById(gigId);

        if (!created) {
            throw new Error(
                "Unable to reload created gig."
            );
        }

        return created;
    },

    async update(
        gigId: number,
        input: {
            venueId: number | null;
            gigDate: string;
            eventName: string | null;
            notes: string | null;
            status: GigStatus;

            lineup: {
                bandId: number;
                role: string;
            }[];
        }
    ): Promise<void> {
        const db = await getDatabase();

        await db.withTransactionAsync(async () => {
            await db.runAsync(
                `
        UPDATE gigs
        SET
          venue_id = ?,
          gig_date = ?,
          event_name = ?,
          notes = ?,
          status = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE gig_id = ?
      `,
                input.venueId,
                input.gigDate,
                input.eventName,
                input.notes,
                input.status,
                gigId
            );

            await db.runAsync(
                `
        DELETE FROM gig_bands
        WHERE gig_id = ?
      `,
                gigId
            );

            for (
                let index = 0;
                index < input.lineup.length;
                index++
            ) {
                const item = input.lineup[index];

                await db.runAsync(
                    `
                    INSERT INTO gig_bands (
                        gig_id,
                        band_id,
                        billing_order,
                        role
                    )
                    VALUES (?, ?, ?, ?)
                    `,
                    gigId,
                    item.bandId,
                    index + 1,
                    item.role
                );
            }
        });
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
        bandIds: [],
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